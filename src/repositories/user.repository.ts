import { User } from "@models/user.model";
import bcrypt from "bcrypt";

export class UserRepository {
  findById(id: string) {
    return User.findById(id).select("-password");
  }

  async updateData(
    id: string,
    data: { name: string; surname: string; email: string }
  ) {
    const user = await User.findById(id);
    if (!user) return null;

    user.name = data.name;
    user.surname = data.surname;
    user.email = data.email;

    await user.save();
    return user;
  }

  async updatePassword(id: string, password: string) {
    const user = await User.findById(id);
    if (!user) return null;

    user.password = password; // surowe
    await user.save(); // hash w pre-save

    return true;
  }

  async softDelete(id: string) {
    const user = await User.findById(id);
    if (!user) return null;

    user.is_active = false;
    await user.save();

    return true;
  }

  findByEmail(email: string) {
    return User.findOne({ email });
  }

  findAll() {
    return User.find().select("-password");
  }

  create(data: {
    name: string;
    surname?: string;
    email: string;
    password: string;
  }) {
    return User.create(data);
  }
  count() {
    return User.countDocuments();
  }

  delete(id: string) {
    return User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
