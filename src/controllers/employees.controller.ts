import type { Request, Response } from "express";
import { employeesRepository } from "@repositories/employees.repository";
import { User } from "@models/user.model";

export class EmployeesController {
   /* ================= VIEW ================= */
  async panel(req: Request, res: Response) {
    const employees = await employeesRepository.findAllWithUserNames();

    // lista userów bez przypisanego stanowiska
    const users = await User.find({
      _id: { $nin: employees.map(e => e.user_id._id) }
    }).select("name surname email");

    res.render("admin/employees", {
      employees,
      users
    });
  }

   /* ================= API ================= */
  async show(req: Request, res: Response) {
    const employees = await employeesRepository.findAllWithUserNames();
    res.json(employees);
  }

  async create(req: Request, res: Response) {
    const { user_id, role } = req.body;

    if (!user_id || !role) {
      return res.status(400).json({ error: "user_id oraz rola są wymagane" });
    }

    const existing = await employeesRepository.findByUserId(user_id);
    if (existing) {
      return res.status(409).json({
        error: "Ten użytkownik ma już przypisaną rolę",
      });
    }

    const employee = await employeesRepository.create({ user_id, role });
    res.status(201).json(employee);
  }

  async update(req: Request, res: Response) {
    const { role } = req.body;

    const updated = await employeesRepository.update(req.params.id, role);
    if (!updated) {
      return res.status(404).json({ error: "Nie znaleziono pracownika" });
    }

    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const deleted = await employeesRepository.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Nie znaleziono pracownika" });
    }

    res.sendStatus(204);
  }
}

export const employeesController = new EmployeesController();