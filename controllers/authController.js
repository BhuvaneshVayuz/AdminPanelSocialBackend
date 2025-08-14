// controllers/authController.js
import axios from "axios";
import jwt from "jsonwebtoken";
import { UserRoleMapping } from "../models/userRoleMappingModel.js"; // adjust path/model name

const PROFILE_BACKEND_URL = "https://profilebackend.vayuz.com/users/api/signin";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRY = "24h";

export const login = async (req, res) => {
    try {
        const { socialId, authenticationCode } = req.body;

        if (!socialId || !authenticationCode) {
            return res.status(400).json({ message: "socialId and authenticationCode are required" });
        }

        // Step 1: Validate credentials with Profile Backend
        const { data } = await axios.post(PROFILE_BACKEND_URL, {
            adminlogin: false,
            email: socialId,
            password: authenticationCode,
            requestfrom: "social"
        });

        if (data.code < 200 || data.code >= 300) {
            return res.status(401).json({ message: "Invalid credentials" });
        }


        // Step 3: Fetch user role (if exists)
        const roleMapping = await UserRoleMapping.find({ userId: socialId }).populate("roleId");
        // Step 4: Generate JWT
        const token = jwt.sign({ socialId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        // Step 5: Send response
        res.json({
            message: "Login successful",
            token,
            name: data?.name,
            role: roleMapping?.[0]?.roleId?.name
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
