import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import sbuRoutes from "./routes/sbuRoutes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import teamRoutes from "./routes/teamRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import childSprintRoutes from "./routes/childSprintRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";




const app = express();


const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));





app.use(express.json());



app.use("/api", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/sbu", sbuRoutes);



app.use("/api/users", userRoutes);


app.use("/api/projects", projectRoutes);
app.use("/api/child-sprints", childSprintRoutes);
app.use("/api/sprints", sprintRoutes);

app.use(errorMiddleware);

export default app;