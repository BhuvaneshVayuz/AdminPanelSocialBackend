import User from "../models/user.model.js";

export const findAll = () => {
  return User.find();
};

export const create = (data) => {
  return new User(data).save();
};

export const findByEmail = async (email) => {
  return await User.findOne({ email });
};
