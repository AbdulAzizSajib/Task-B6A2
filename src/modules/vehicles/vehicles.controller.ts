import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);

    if (!result) {
      return res.status(409).json({
        success: false,
        message: "This registration number already exists",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Vehicle created Successfully",
        data: result?.rows[0],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No vehicles found",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieved successfully",
        data: result?.rows,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.getVehicleById(vehicleId!);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Vehicle not found",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result?.rows[0],
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const payload = req.body;
    const result = await vehicleService.updateVehicle(payload, vehicleId!);
    if (!result) {
      return res.status(409).json({
        success: false,
        message: "This registration number is already registered",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result?.rows[0],
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.deleteVehicle(vehicleId!);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
