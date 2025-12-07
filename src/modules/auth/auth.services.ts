import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./../../config/db";
import { config } from "../../config";

const login = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }

  const { password: hashedPassword, ...user } = result?.rows[0];

  const matchPass = await bcrypt.compare(password, hashedPassword);

  if (!matchPass) {
    return false;
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },

    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  return { token, user };
};

export const authService = {
  login,
};
