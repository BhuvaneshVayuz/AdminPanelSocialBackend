import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/projectRoutes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

app.use(errorMiddleware);

export default app;
