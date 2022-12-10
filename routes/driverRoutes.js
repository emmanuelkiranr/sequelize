import driverController from "../controller/driverController.js";
import express from "express";

const router = express.Router();

// app.get("/driver/get", (req, res) => {
//   res.end(driverController.getAll);
// }); - This code from index.js is convert to the below in routers

router.post("/driver/create", driverController.create);
router.get("/driver/get", driverController.getAll);
router.post("/driver/search", driverController.search);

export default router;
