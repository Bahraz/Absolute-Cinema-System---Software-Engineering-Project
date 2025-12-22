import type { Request, Response } from "express";
import { Employees } from "@models/employees";

export class EmployeesController {
  // 1. Lista pracowników
  async show(req: Request, res: Response) {
    try {
      const employees = await Employees.find().populate("user_id");
      res.status(200).json(employees);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania pracowników",
        details: err,
      });
    }
  }

  // 2. Dodaj pracownika
  async create(req: Request, res: Response) {
    try {
      const { user_id, role } = req.body;

      if (!user_id || !role) {
        return res.status(400).json({
          error: "user_id oraz rola są wymagane",
        });
      }

      // 🔒 Jeden user = jedno stanowisko
      const existingEmployee = await Employees.findOne({ user_id });
      if (existingEmployee) {
        return res.status(409).json({
          error: "Ten użytkownik ma już przypisane stanowisko",
        });
      }

      const newEmployee = new Employees({ user_id, role });
      const savedEmployee = await newEmployee.save();

      res.status(201).json(savedEmployee);
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania pracownika",
        details: err,
      });
    }
  }

  // 3. Edytuj pracownika
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          error: "Rola nie może być pusta",
        });
      }

      const updatedEmployee = await Employees.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({
          error: "Nie znaleziono pracownika",
        });
      }

      res.status(200).json(updatedEmployee);
    } catch (err) {
      res.status(500).json({
        error: "Błąd edycji pracownika",
        details: err,
      });
    }
  }

  // 4. Usuń pracownika
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedEmployee = await Employees.findByIdAndDelete(id);

      if (!deletedEmployee) {
        return res.status(404).json({
          error: "Nie znaleziono pracownika",
        });
      }

      res.status(200).json({
        message: "Pracownik został usunięty",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania pracownika",
        details: err,
      });
    }
  }
}

export const employeesController = new EmployeesController();
