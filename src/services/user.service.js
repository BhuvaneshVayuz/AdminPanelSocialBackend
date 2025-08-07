const { error } = require("console");
const userRepo = require("../repositories/user.repository");

exports.getUsers = () => {
  return userRepo.findAll();
};

exports.createUser = (data) => {
  const { email } = data;
  const existingUser = userRepo.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already exist");
  }
  return userRepo.create(data);
};
