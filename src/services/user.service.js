import { error } from "console";
import * as userRepo from "../repositories/user.repository.js";

export const getUsers = () => {
  return userRepo.findAll();
};

export const createUser = async (data) => {
  const { email } = data;
  const existingUser = await userRepo.findByEmail(email);
  console.log(existingUser);
  if (existingUser) {
    throw new Error("Email already exist");
  }
  return userRepo.create(data);
};
