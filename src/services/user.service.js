import { error } from "console";
import * as userRepo from "../repositories/user.repository.js";

export const getUsers = () => {
  return userRepo.findAll();
};

export const createUser = (data) => {
  const { email } = data;
  const existingUser = userRepo.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already exist");
  }
  return userRepo.create(data);
};
