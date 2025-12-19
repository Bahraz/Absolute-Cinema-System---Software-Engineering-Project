import type { Request, Response } from "express";
import mongoose from "mongoose";
import { UserRole } from "@models/userRoleModel";
import { Role } from "@models/roleModel";
import { User } from "@models/userModel";

export class UsersRolesController {
  // === GET ALL USER ROLES ===
  async getAll(req: Request, res: Response) {
    try {
      const userRoles = await UserRole.find()
        .populate("user_id", "name email")
        .populate("role_id", "name")
        .sort({ user_id: 1 });
      res.json(userRoles);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania ról użytkowników" });
    }
  }

  // === GET ROLES FOR USER ===
async getByUser(req: Request, res: Response) {
    // Dopasowanie nazwy parametru do routingu
    const { idUser } = req.params;

    // Sprawdzenie poprawności ObjectId
    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      return res.status(400).json({ error: "Nieprawidłowe ID użytkownika" });
    }

    try {
      const userObjectId = new mongoose.Types.ObjectId(idUser);

      const roles = await UserRole.find({ user_id: userObjectId })
        .populate<{ role_id: { _id: string; name: string } }>("role_id", "name")
        .exec();

      if (roles.length === 0) {
        return res
          .status(404)
          .json({ message: "Użytkownik nie ma przypisanych ról" });
      }

      // Mapowanie populated role_id
      const result = roles.map(r => ({
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

  // === GET USERS BY ROLE ===
async getByRole(req: Request, res: Response) {
  const { idRole } = req.params;

  // Sprawdzenie poprawności ObjectId
  if (!mongoose.Types.ObjectId.isValid(idRole)) {
    return res.status(400).json({ error: "Nieprawidłowe ID roli" });
  }

  try {
    const roleObjectId = new mongoose.Types.ObjectId(idRole);

    const usersRoles = await UserRole.find({ role_id: roleObjectId })
      .populate<{ user_id: { _id: string; name: string; surname: string; email: string } }>(
        "user_id",
        "name surname email"
      )
      .exec();

    if (usersRoles.length === 0) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono użytkowników z tą rolą" });
    }

    const result = usersRoles.map(r => ({
      _id: r.user_id._id,
      name: r.user_id.name,
      surname: r.user_id.surname,
      email: r.user_id.email,
    }));

    res.status(200).json(result);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Nieznany błąd",
    });
  }
}


  // === ASSIGN ROLE TO USER ===
  async assign(req: Request, res: Response) {
    try {
      const { user_id, role_id } = req.body;

      if (!user_id || !role_id) {
        return res.status(400).json({ error: "Brak wymaganych danych: user_id lub role_id" });
      }

      const userRole = new UserRole({ user_id, role_id });
      await userRole.save();

      res.status(201).json(userRole);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Ta rola jest już przypisana do użytkownika" });
      }
      res.status(500).json({ error: "Błąd przypisywania roli" });
    }
  }

  // === REMOVE ROLE FROM USER ===
  async remove(req: Request, res: Response) {
    try {
      const { user_id, role_id } = req.body;

      const deleted = await UserRole.findOneAndDelete({ user_id, role_id });

      if (!deleted) return res.status(404).json({ error: "Nie znaleziono przypisania roli" });

      res.json({ message: "Rola została usunięta z użytkownika" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania roli użytkownika" });
    }
  }
}

export const usersRolesController = new UsersRolesController();
