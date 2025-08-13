// routes/authRoutes.js
import express from "express";
import { login } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

// Example protected route
router.get("/profile", authenticateUser, (req, res) => {
    res.json({ message: "Profile data", socialId: req.user.socialId });
});

export default router;
