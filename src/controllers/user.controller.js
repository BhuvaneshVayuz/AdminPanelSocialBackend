const { error } = require("console");
const userService = require("../services/user.service");
const { sendResponse, sendErrorResponse } = require("../utils/responseHandler");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();

    sendResponse({
      res,
      statusCode: 200,
      message: "user fetch successfully ",
      data: users,
    });
    // res.status(200).json({ data: users, message: "User fetched successfully" });
  } catch (err) {
    // next(err);
    sendErrorResponse({
      res,
      statusCode: 400,
      message: err?.message,
      error: err,
    });
  }
};

exports.createUser = async (req, res) => {
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
      message: "user created successfully ",
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
    // next(err);
  }
};
