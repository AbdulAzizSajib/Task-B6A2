import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
    VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );

  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  return {
    booking: result.rows[0],
    vehicle: vehicleResult.rows[0],
  };
};

const getAllBookings = async (role: string, userId?: number) => {
  console.log("userRole", role, "userId", userId);
  let query = "";
  let params: any[] = [];

  if (role === "admin") {
    query = `
      SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        u.name as customer_name,
        u.email as customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
    `;
  } else {
    query = `
      SELECT 
        b.id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,
        v.vehicle_name,
        v.registration_number,
        v.type
      FROM bookings b
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
    `;
    params = [userId];
  }

  const result = await pool.query(query, params);

  console.log("result", result);
  return result;
};

const updateBooking = async (
  payload: Record<string, unknown>,
  id: number,
  userRole: string,
  userId?: number
) => {
  const { status } = payload;

  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [id]
  );

  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  if (userRole === "customer") {
    if (booking.customer_id !== userId) {
      throw new Error("You can only cancel your own bookings");
    }

    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(booking.rent_start_date);
    startDate.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      throw new Error("You can only cancel bookings before the start date");
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    return { booking: result.rows[0] };
  }

  if (userRole === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark bookings as returned");
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
      ["available", booking.vehicle_id]
    );

    const vehicleResult = await pool.query(
      `SELECT availability_status FROM vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      booking: result.rows[0],
      vehicle: vehicleResult.rows[0],
    };
  }

  throw new Error("Invalid role");
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
