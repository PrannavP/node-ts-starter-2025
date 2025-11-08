import express, { Application } from "express";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

// Use the express middlewar to parse the data in json
app.use(express.json());

// Route to user related
app.use("/api/user", userRoutes);

// Route to auth related
app.use("/api/auth", authRoutes);

export default app;