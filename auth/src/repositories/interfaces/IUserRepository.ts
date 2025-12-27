// domain/user.repository.ts
import { User } from "../../domain/user.entity";
export interface IUser {
  userId: string;
  username: string;
  password: string;
}

export interface IUserRepository {
  createUser(user: IUser): Promise<IUser>;
  getUserById(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
}
