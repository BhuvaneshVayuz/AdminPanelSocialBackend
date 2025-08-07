const User = require("../models/user.model");

exports.findAll = () => {
  return User.find();
};

exports.create = (data) => {
  return new User(data).save();
};

exports.findByEmail = async (email) => {
  return await User.findOne({ email });
};
