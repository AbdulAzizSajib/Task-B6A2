import express from "express";

import { userServices } from "./users.service";

const createUser = async (req: express.Request, res: express.Response) => {
  try {
    const result = await userServices.createUser(req.body);

    if (!result) {
      return res.json({
        success: false,
        message: "This email is already registered",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result?.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const result = await userServices.getAllUsers();
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
        data: result.rows,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User retrieved  successfully",
        data: result?.rows,
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

const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const payload = req.body;

    const result = await userServices.updateUser(payload, userId!);
    if (!result) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        data: result?.rows[0],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;

    const result = await userServices.deleteUser(userId!);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
