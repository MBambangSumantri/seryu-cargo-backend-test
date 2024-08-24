import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import ShipmentCost from "./shipmentCost";

class Shipment extends Model {
  public shipment_no!: string;
  public shipment_date!: string;
  public shipment_status!: string;

  public readonly ShipmentCosts?: ShipmentCost[];
}

Shipment.init(
  {
    shipment_no: {
      type: DataTypes.STRING,
    },
    shipment_date: {
      type: DataTypes.STRING,
    },
    shipment_status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "shipments",
  }
);

export default Shipment;
