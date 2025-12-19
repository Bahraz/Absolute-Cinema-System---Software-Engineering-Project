import type { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "@models/userModel";
import { UserRole } from "@models/userRoleModel";
import { Role } from "@models/roleModel";
import bcrypt from "bcrypt";

export class UserController {
  // === GET ALL USERS ===
  async getAll(req: Request, res: Response) {
    try {
      const users = await User.find().sort({ name: 1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania użytkowników" });
    }
  }

  // === GET ONE USER BY ID ===
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await User.findById(id).exec();
      if (!user)
        return res.status(404).json({ error: "Użytkownik nie istnieje" });

      const userRoles = await UserRole.find({ user_id: id })
        .populate("role_id", "name")
        .exec();

      const roles = userRoles.map((ur) => {
        const role = ur.role_id as unknown as { _id: string; name: string };
        return { _id: role._id, name: role.name };
      });

      res.json({ user, roles });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd pobierania użytkownika" });
    }
  }

  // === CREATE USER ===
  async create(req: Request, res: Response) {
    try {
      const { name, surname, email, password } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Brak wymaganych danych: name, email lub password" });
      }

      const existing = await User.findOne({ email });
      if (existing)
        return res
          .status(409)
          .json({ error: "Użytkownik o tym emailu już istnieje" });

      const user = new User({ name, surname, email, password });
      await user.save();

      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: "Błąd tworzenia użytkownika" });
    }
  }

  // === UPDATE USER ===
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, surname, email, password } = req.body;

      const user = await User.findById(id);
      if (!user)
        return res.status(404).json({ error: "Użytkownik nie istnieje" });

      if (name) user.name = name;
      if (surname !== undefined) user.surname = surname;
      if (email) user.email = email;
      if (password) user.password = password; // pre-save hook zahashuje

      await user.save();
      res.json(user);
    } catch (err: any) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ error: "Użytkownik o tym emailu już istnieje" });
      }
      res.status(500).json({ error: "Błąd aktualizacji użytkownika" });
    }
  }

  // === DELETE USER ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ error: "Użytkownik nie istnieje" });

      // Usuń też przypisania ról
      await UserRole.deleteMany({ user_id: id });

      res.json({ message: "Użytkownik został usunięty" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania użytkownika" });
    }
  }

  // === AUTHENTICATE USER (login) ===
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: "Brak email lub hasła" });

      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ error: "Niepoprawny email lub hasło" });

      const valid = user.comparePassword(password);
      if (!valid)
        return res.status(401).json({ error: "Niepoprawny email lub hasło" });

      res.json({ user, apiToken: user.apiToken });
    } catch (err) {
      res.status(500).json({ error: "Błąd logowania" });
    }
  }

  // === GET USER ROLES ===
  async getRoles(req: Request, res: Response) {
    const { user_id } = req.params;

    // Sprawdzenie poprawności ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ error: "Nieprawidłowe ID użytkownika" });
    }

    try {
      const userObjectId = new mongoose.Types.ObjectId(user_id);

      const roles = await UserRole.find({ user_id: userObjectId })
        .populate<{ role_id: { _id: string; name: string } }>("role_id", "name")
        .exec();

      if (roles.length === 0) {
        return res
          .status(404)
          .json({ message: "Użytkownik nie ma przypisanych ról" });
      }

      const result = roles.map((r) => ({
        _id: r.role_id._id,
        name: r.role_id.name,
      }));

      res.status(200).json(result);
    } catch (err: unknown) {
      console.error(err);
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
}
export const userController = new UserController();
