import { Request, Response } from "express";
import { authService } from "./auth.services";
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // console.log(email, password);
    const result = await authService.login(email, password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid email address or password",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "login successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "server error",
      data: error,
    });
  }
};

export const authController = {
  login,
};
