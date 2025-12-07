import express from "express";
import cors from "cors";
import { config } from "./config";
import { connectDB } from "./config/db";
import userRouter from "./modules/users/users.routes";
import authRouter from "./modules/auth/auth.routes";
import vehicleRouter from "./modules/vehicles/vehicles.routes";
import bookingRouter from "./modules/bookings/bookings.routes";

const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//database connection
connectDB();

// health test
app.get("/health", (req: express.Request, res: express.Response) => {
  res.status(200).send("Server is okay!");
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.use("/api/v1", userRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", vehicleRouter);
app.use("/api/v1", bookingRouter);
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
