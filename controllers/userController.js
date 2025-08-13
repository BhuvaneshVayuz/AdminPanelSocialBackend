// controllers/userController.js
import axios from "axios";

export const getUsers = async (req, res) => {
    try {
        const response = await axios.get(
            "https://social-beta.vayuz.com/v1/admin/users/getOtherUsers",
            {
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl9pZDE3MzM0MDE3Mzg5MTgiLCJyb2xlIjoidXNlciIsImlhdCI6MTczMzQwMjU0MX0.82mbwwPdu-1uNKhj1Rz4xY_6dS9rd4iCIOrpRsl2Wa4",
                },
            }
        );

        const users = response.data?.data?.map((user) => ({
            fullname: user.fullname,
            email: user.email,
            employee_id: user.employee_id,
        }));

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
