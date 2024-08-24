import express, { Application } from "express";
import sequelize from "./config/database";
import routes from "./routes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/v1", routes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Unable to connect to the database:", err));
