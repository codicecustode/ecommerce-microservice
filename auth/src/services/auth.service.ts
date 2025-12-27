import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuthService } from "./interfaces/IAuthService";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { secrets } from "../config/env.config";
import { nanoid } from 'nanoid';

export default class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async findUserByUsername(username: string) {
    return this.userRepository.getUserByUsername(username);
  }

  async getUserById(id: string) {
    return this.userRepository.getUserById(id);
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.getUserByUsername(username);

    if (!user) {
      return { success: false, message: "User not found with this username" };
    }

    const isMatch = await bcrypt.compare(password, user.getPasswordHash());

    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }

    const token = jwt.sign({ userId: user.userId }, secrets.jwtSecret);

    return { success: true, token };
  }

  async register(user: any) {
    const userId = nanoid(10);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.userId = userId;

    return this.userRepository.createUser(user);
  }
}
