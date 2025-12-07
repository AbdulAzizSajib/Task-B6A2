import { Pool } from "pg";
import { config } from ".";

export const pool = new Pool({
  connectionString: `${config.connection_string}`,
});

export const connectDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(100)  NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL
        )`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price DECIMAL(10,2) NOT NULL,
        availability_status VARCHAR(50) NOT NULL
        )`);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id),
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        rent_start_date DATE  NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price DECIMAL NOT NULL,
        status VARCHAR(50) NOT NULL
        
        )`);
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
