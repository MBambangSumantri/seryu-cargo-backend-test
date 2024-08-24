import { Request, Response } from "express";
import {
  Driver,
  DriverAttendance,
  Shipment,
  ShipmentCost,
  VariableConfig,
} from "../models";
import sequelize from "../config/database";
import { Op, WhereOptions } from "sequelize";

export const getDriverSalaries = async (req: Request, res: Response) => {
  const {
    month,
    year,
    current = 1,
    page_size = 10,
    driver_code,
    name,
  } = req.query;

  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;

  const limit = parseInt(page_size as string, 10);
  const offset = (parseInt(current as string, 10) - 1) * limit;

  try {
    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required." });
    }

    const attendanceSalary = await VariableConfig.findOne({
      where: { key: "DRIVER_MONTHLY_ATTENDANCE_SALARY" },
      attributes: ["value"],
    });

    const salary = attendanceSalary ? attendanceSalary.value : 0;

    const whereConditions: any = {};

    if (driver_code) {
      whereConditions.driver_code = driver_code;
    }

    if (name) {
      whereConditions.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    // Ambil semua driver dengan gaji > 0 berdasarkan status dan filter
    const allDrivers = await Driver.findAll({
      attributes: ["driver_code", "name"],
      where: whereConditions,
      include: [
        {
          model: DriverAttendance,
          attributes: [],
          where: sequelize.where(
            sequelize.fn(
              "EXTRACT",
              sequelize.literal("MONTH FROM CAST(attendance_date AS DATE)")
            ),
            month
          ),
          required: false,
        },
        {
          model: ShipmentCost,
          attributes: [],
          include: [
            {
              model: Shipment,
              attributes: [],
              where: {
                shipment_status: {
                  [Op.not]: "CANCELLED",
                },
              },
            },
          ],
          required: false,
        },
      ],
      group: ["Driver.id", "Driver.driver_code"],
      having: getStatusHavingClause(status, salary),
    });

    const total_row = allDrivers.length;

    const driverSalaries = await Driver.findAll({
      attributes: ["driver_code", "name"],
      where: whereConditions,
      include: [
        {
          model: DriverAttendance,
          attributes: [
            "id",
            "driver_code",
            "attendance_date",
            "attendance_status",
          ],
          where: sequelize.where(
            sequelize.fn(
              "EXTRACT",
              sequelize.literal("MONTH FROM CAST(attendance_date AS DATE)")
            ),
            month
          ),
          required: false,
        },
        {
          model: ShipmentCost,
          attributes: [
            "id",
            "driver_code",
            "shipment_no",
            "total_costs",
            "cost_status",
          ],
          include: [
            {
              model: Shipment,
              attributes: ["shipment_no", "shipment_date", "shipment_status"],
              where: {
                shipment_status: {
                  [Op.not]: "CANCELLED",
                },
              },
              as: "Shipment",
            },
          ],
          required: false,
          as: "ShipmentCosts",
        },
      ],
      group: [
        "Driver.id",
        "Driver.driver_code",
        "Driver.name",
        "DriverAttendances.id",
        "ShipmentCosts.id",
        "ShipmentCosts->Shipment.shipment_no",
      ],
      having: getStatusHavingClause(status, salary),
      // limit and offset can be added as needed
    });

    const data = driverSalaries.map(driver => {
      const totalPending =
        driver.ShipmentCosts?.reduce(
          (acc, sc) =>
            sc.cost_status === "PENDING" ? acc + sc.total_cost : acc,
          0
        ) ?? 0;

      const totalConfirmed =
        driver.ShipmentCosts?.reduce(
          (acc, sc) =>
            sc.cost_status === "CONFIRMED" ? acc + sc.total_cost : acc,
          0
        ) ?? 0;

      const totalPaid =
        driver.ShipmentCosts?.reduce(
          (acc, sc) => (sc.cost_status === "PAID" ? acc + sc.total_cost : acc),
          0
        ) ?? 0;

      const totalAttendanceSalary =
        (driver.DriverAttendances?.length || 0) * salary;

      const totalSalary =
        totalPending + totalConfirmed + totalPaid + totalAttendanceSalary;

      const countShipment = driver.ShipmentCosts?.filter(
        sc => sc.Shipment?.shipment_status !== "CANCELLED"
      ).length;

      return {
        driver_code: driver.driver_code,
        name: driver.name,
        total_pending: totalPending,
        total_confirmed: totalConfirmed,
        total_paid: totalPaid,
        total_attendance_salary: totalAttendanceSalary,
        total_salary: totalSalary,
        count_shipment: countShipment,
      };
    });

    res.json({
      data,
      total_row,
      current: parseInt(current as string, 10),
      page_size: limit,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

function getStatusHavingClause(
  status: string | undefined,
  salary: number
): WhereOptions {
  switch (status) {
    case "PENDING":
      return sequelize.literal(
        `SUM(CASE WHEN "ShipmentCosts"."cost_status" = 'PENDING' THEN "ShipmentCosts"."total_costs" ELSE 0 END) > 0`
      );
    case "CONFIRMED":
      return sequelize.literal(
        `SUM(CASE WHEN "ShipmentCosts"."cost_status" = 'CONFIRMED' THEN "ShipmentCosts"."total_costs" ELSE 0 END) > 0`
      );
    case "PAID":
      return sequelize.literal(`
          SUM(CASE WHEN "ShipmentCosts"."cost_status" = 'PAID' THEN "ShipmentCosts"."total_costs" ELSE 0 END) > 0
          AND SUM(CASE WHEN "ShipmentCosts"."cost_status" IN ('PENDING', 'CONFIRMED') THEN "ShipmentCosts"."total_costs" ELSE 0 END) = 0
        `);
    default:
      return sequelize.literal(`
          SUM(CASE 
            WHEN "ShipmentCosts"."cost_status" = 'PENDING' THEN "ShipmentCosts"."total_costs" 
            WHEN "ShipmentCosts"."cost_status" = 'CONFIRMED' THEN "ShipmentCosts"."total_costs" 
            WHEN "ShipmentCosts"."cost_status" = 'PAID' THEN "ShipmentCosts"."total_costs" 
            ELSE 0 
          END) + COUNT(DISTINCT "DriverAttendances"."id") * ${salary} > 0
        `);
  }
}
