// controllers/authController.js
import axios from "axios";
import jwt from "jsonwebtoken";

const PROFILE_BACKEND_URL = "https://profilebackend.vayuz.com/users/api/signin";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // Use env variable in prod
const JWT_EXPIRY = "1h"; // Token expiry time

// POST /api/login
export const login = async (req, res) => {
    try {
        const { socialId, authenticationCode } = req.body;

        if (!socialId || !authenticationCode) {
            return res.status(400).json({ message: "socialId and authenticationCode are required" });
        }

        // Send credentials to profile backend
        const { data } = await axios.post(PROFILE_BACKEND_URL, {
            adminlogin: false,
            email: socialId,
            password: authenticationCode,
            requestfrom: "social"
        });


        // Check if credentials are valid
        if (data.code < 200 || data.code >= 300) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ socialId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
