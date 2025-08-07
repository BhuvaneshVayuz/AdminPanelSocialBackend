import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/projectRoutes.js";
import sbuRoutes from "./routes/sbuRoutes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import teamRoutes from "./routes/teamRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api/teams", teamRoutes);
app.use("/api/sbu", sbuRoutes);

app.use(errorMiddleware);

export default app;
