import { Router } from "express";
import { getDriverSalaries } from "../controller";

const router = Router();

router.get("/salary/driver/list", getDriverSalaries);

export default router;
