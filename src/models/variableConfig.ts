import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class VariableConfig extends Model {
  public key!: string;
  public value!: number;
}

VariableConfig.init(
  {
    key: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "variable_configs",
  }
);

export default VariableConfig;
