import express from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const vehicleRouter = express.Router();

vehicleRouter.post("/vehicles", auth("admin"), vehicleController.createVehicle);
vehicleRouter.get(
  "/vehicles",
  auth("admin", "customer"),
  vehicleController.getAllVehicles
);
vehicleRouter.get(
  "/vehicles/:vehicleId",
  auth("admin", "customer"),
  vehicleController.getVehicleById
);
vehicleRouter.put(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleController.updateVehicle
);
vehicleRouter.delete(
  "/vehicles/:vehicleId",
  auth("admin"),
  vehicleController.deleteVehicle
);

export default vehicleRouter;
