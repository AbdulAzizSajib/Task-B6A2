import { Request, Response } from "express";
import { bookingService } from "./bookings.services";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);

    res.json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...result.booking,
        vehicle: {
          vehicle_name: result.vehicle.vehicle_name,
          daily_rent_price: result.vehicle.daily_rent_price,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const result = await bookingService.getAllBookings(userRole, userId);

    let formattedData;
    if (userRole === "admin") {
      formattedData = result?.rows.map((booking: any) => ({
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        customer: {
          name: booking.customer_name,
          email: booking.customer_email,
        },
        vehicle: {
          vehicle_name: booking.vehicle_name,
          registration_number: booking.registration_number,
        },
      }));
    } else {
      formattedData = result?.rows.map((booking: any) => ({
        id: booking.id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
          vehicle_name: booking.vehicle_name,
          registration_number: booking.registration_number,
          type: booking.type,
        },
      }));
    }

    res.status(200).json({
      success: true,
      message:
        userRole === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: formattedData,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const payload = req.body;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const result = await bookingService.updateBooking(
      payload,
      Number(bookingId),
      userRole,
      userId
    );

    if (payload.status === "cancelled") {
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result.booking,
      });
    } else if (payload.status === "returned") {
      res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          ...result.booking,
          vehicle: {
            availability_status: result.vehicle?.availability_status,
          },
        },
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        data: result.booking,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
