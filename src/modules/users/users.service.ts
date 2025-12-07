import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  //validate if user already exists
  const userExists = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userExists.rows.length > 0) {
    return null;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password as string, salt);

  const result = await pool.query(
    `INSERT INTO users(name, email, password,phone, role) VALUES($1,$2,$3,$4,$5) RETURNING id, name, email, phone, role`,
    [name, email, hashedPass, phone, role]
  );

  return result;
};

// get users and remove password from response
const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users `
  );

  return result;
};

//update users

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const { name, email, password, phone } = payload;

  // validate if user already exists
  const userExists = await pool.query(
    `SELECT * FROM users WHERE email=$1 AND id<>$2`,
    [email, id]
  );

  if (userExists.rows.length > 0) {
    return null;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password as string, salt);

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, password=$3, phone=$4 WHERE id=$5 RETURNING id, name, email, phone, role`,
    [name, email, hashedPass, phone, id]
  );

  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users  WHERE id = $1`, [id]);
  return result;
};

export const userServices = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
