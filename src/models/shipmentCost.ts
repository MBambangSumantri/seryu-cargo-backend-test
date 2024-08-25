import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Shipment from "./shipment";

class ShipmentCost extends Model {
  public id!: number;
  public driver_code!: string;
  public shipment_no!: string;
  public total_costs!: number;
  public cost_status!: string;

  public readonly Shipment?: Shipment;
}

ShipmentCost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    driver_code: {
      type: DataTypes.STRING,
    },
    shipment_no: {
      type: DataTypes.STRING,
      references: {
        model: Shipment,
        key: "shipment_no",
      },
    },
    total_costs: {
      type: DataTypes.FLOAT,
    },
    cost_status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "shipment_costs",
  }
);

ShipmentCost.belongsTo(Shipment, {
  foreignKey: "shipment_no",
  targetKey: "shipment_no",
});
Shipment.hasMany(ShipmentCost, {
  foreignKey: "shipment_no",
  sourceKey: "shipment_no",
});

export default ShipmentCost;
