import { error } from "console";
import * as userService from "../services/user.service.js";
import { sendResponse, sendErrorResponse } from "../utils/responseHandler.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();

    sendResponse({
      res,
      statusCode: 200,
      message: "User fetched successfully",
      data: users,
    });
  } catch (err) {
    sendErrorResponse({
      res,
      statusCode: 400,
      message: err?.message,
      error: err,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    // ✅ Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const data = {
      name,
      email,
      age,
    };
    const createdUser = await userService.createUser(data);
    sendResponse({
      res,
      statusCode: 201,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (err) {
    console.log(err, "error");
    sendErrorResponse({
      res,
      statusCode: 400,
      message: err?.message,
      error: err,
    });
  }
};
