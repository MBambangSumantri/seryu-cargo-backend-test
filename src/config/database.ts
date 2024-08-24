import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME as string;
const DB_PASSWORD = process.env.DB_PASS as string;
const DB_DATABASE = process.env.DB_NAME as string;
const DB_HOST = process.env.DB_HOST as string;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
});

export default sequelize;
