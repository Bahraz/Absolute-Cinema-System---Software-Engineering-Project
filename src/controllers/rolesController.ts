import type { Request, Response } from "express";
import { Role } from "@models/roleModel";

export class RolesController {
  // === GET ALL ROLES ===
  async getAll(req: Request, res: Response) {
    try {
      const roles = await Role.find().sort({ name: 1 });
      res.json(roles);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania ról" });
    }
  }

  // === GET ROLE BY ID ===
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);

      if (!role) return res.status(404).json({ error: "Rola nie istnieje" });

      res.json(role);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania roli" });
    }
  }

  // === CREATE ROLE ===
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) return res.status(400).json({ error: "Nazwa roli jest wymagana" });

      const existing = await Role.findOne({ name });
      if (existing)
        return res.status(409).json({ error: "Rola o tej nazwie już istnieje" });

      const role = new Role({ name });
      await role.save();

      res.status(201).json(role);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Rola o tej nazwie już istnieje" });
      }
      res.status(500).json({ error: "Nie udało się utworzyć roli" });
    }
  }

  // === UPDATE ROLE ===
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) return res.status(400).json({ error: "Nazwa roli jest wymagana" });

      const existing = await Role.findOne({ name, _id: { $ne: id } });
      if (existing)
        return res.status(409).json({ error: "Rola o tej nazwie już istnieje" });

      const updated = await Role.findByIdAndUpdate(id, { name }, { new: true });

      if (!updated) return res.status(404).json({ error: "Rola nie istnieje" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Błąd aktualizacji roli" });
    }
  }

  // === DELETE ROLE ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Role.findByIdAndDelete(id);

      if (!deleted) return res.status(404).json({ error: "Rola nie istnieje" });

      res.json({ message: "Rola została usunięta" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania roli" });
    }
  }
}

export const rolesController = new RolesController();
