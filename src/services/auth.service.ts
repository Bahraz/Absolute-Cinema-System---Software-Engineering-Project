import { userRepository } from "@repositories/user.repository";
import { employeesRepository } from "@repositories/employees.repository";

export type UserRole = "ADMIN" | "USER";

export interface AuthenticatedUser {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  role: UserRole;
}

export class AuthService {
  async register(data: {
    name: string;
    surname?: string;
    email: string;
    password: string;
  }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("EMAIL_EXISTS");
    }

    return userRepository.create(data);
  }

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await userRepository.findByEmail(email);

    if (!user || !user.comparePassword(password)) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const employee = await employeesRepository.findByUserId(
      user._id.toString()
    );

    const role: UserRole = employee ? "ADMIN" : "USER";

    return {
      _id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      role,
    };
  }
}

export const authService = new AuthService();
