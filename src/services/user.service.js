const { error } = require("console");
const userRepo = require("../repositories/user.repository");

exports.getUsers = () => {
  return userRepo.findAll();
};

exports.createUser = async (data) => {
  const { email } = data;
  const existingUser = await userRepo.findByEmail(email);
  console.log(existingUser);
  if (existingUser) {
    throw new Error("Email already exist");
  }
  return userRepo.create(data);
};
