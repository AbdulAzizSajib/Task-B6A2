import express from "express";
import { bookingController } from "./bookings.controller";

import auth from "../../middleware/auth";
const bookingRouter = express.Router();

bookingRouter.post(
  "/bookings",
  auth("admin", "customer"),
  bookingController.createBooking
);
bookingRouter.get(
  "/bookings",
  auth("admin", "customer"),
  bookingController.getAllBookings
);
bookingRouter.put(
  "/bookings/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking
);

export default bookingRouter;
