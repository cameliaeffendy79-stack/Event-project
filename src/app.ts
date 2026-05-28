import dotenv from "dotenv";
import express from "express";
import cors from "cors";


import eventRoutes from "./routes/event.routes";
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.routes";
import "./cron/pointExpiration.cron";
import userRoutes from "./routes/user.routes";
import pointRoutes from "./routes/point.routes";

dotenv.config();

const app = express();

app.use(cors(
{origin: "http://localhost:5173"}
));
app.use(express.json());

// ✅ EVENT ROUTES
app.use("/events", eventRoutes);

// ✅ AUTH ROUTES
app.use("/auth", authRoutes);

app.use(
  "/transactions",
  transactionRoutes
);

app.use("/points", pointRoutes);

app.use("/users", userRoutes);

export default app;