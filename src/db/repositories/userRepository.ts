import { User } from "@/models/user";

export interface UserRepository {
  findUserByEmail(email: string): Promise<User | null>;
  // User ID is generated by the database
  createUser(userData: Omit<User, "id">): Promise<User>;
}
