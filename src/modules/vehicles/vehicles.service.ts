import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const vehicleExists = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number=$1`,
    [registration_number]
  );

  if (vehicleExists.rows.length > 0) {
    return null;
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number,daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

// get Vehicles
const getAllVehicles = async () => {
  const result = pool.query(`SELECT * FROM vehicles`);
  return result;
};

//get vehicles by id
const getVehicleById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};

// update vehicles
const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  // add validation for unique registration number
  const vehicleExists = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number=$1 AND id<>$2`,
    [registration_number, id]
  );

  if (vehicleExists.rows.length > 0) {
    return null;
  }

  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};

// delete vehicles
const deleteVehicle = async (id: string) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return result;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
