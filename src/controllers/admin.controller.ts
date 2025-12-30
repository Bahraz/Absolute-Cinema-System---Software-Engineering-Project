import type { Request, Response } from "express";
import { userRepository } from "@repositories/user.repository";
import { employeesRepository } from "@repositories/employees.repository";
import { EmployeeRole } from "@models/employees.model";
import { movieRepository } from "@repositories/movie.repository";
import { screeningRepository } from "@repositories/screening.repository";
import { reservationRepository } from "@repositories/reservation.repository";

export class AdminController {
  async dashboard(req: Request, res: Response) {
    res.status(200).json({
      message: "Panel administratora",
      admin: req.user,
    });
  }

  async dashboardStats(req: Request, res: Response) {
    try {
      const [
        usersCount,
        employeesCount,
        moviesCount,
        screeningsCount,
        reservationsCount,
        upcomingScreenings,
      ] = await Promise.all([
        userRepository.count(),
        employeesRepository.count(),
        movieRepository.count(),
        screeningRepository.count(),
        reservationRepository.count(),
        screeningRepository.findUpcoming(),
      ]);

      res.status(200).json({
        users: usersCount,
        employees: employeesCount,
        movies: moviesCount,
        screenings: screeningsCount,
        reservations: reservationsCount,
        upcomingScreenings,
      });
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
      res.status(500).json({
        error: "Błąd ładowania dashboardu",
        details: err instanceof Error ? err.message : err,
      });
    }
  }

  async getEmployees(req: Request, res: Response) {
    try {
      const employees = await employeesRepository.findAllWithUserNames();
      res.status(200).json(employees);
    } catch {
      res.status(500).json({ error: "Błąd pobierania pracowników" });
    }
  }

  async addEmployee(req: Request, res: Response) {
    try {
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res.status(400).json({ error: "userId i role są wymagane" });
      }

      if (!["Pracownik", "Kierownik"].includes(role)) {
        return res.status(400).json({ error: "Nieprawidłowa rola" });
      }

      const user = await userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Użytkownik nie istnieje" });
      }

      const existing = await employeesRepository.findByUserId(userId);
      if (existing) {
        return res.status(409).json({
          error: "Ten użytkownik jest już pracownikiem",
        });
      }

      const employee = await employeesRepository.create({
        user_id: user._id.toString(),
        role: role as EmployeeRole,
      });

      res.status(201).json({ message: "Pracownik dodany", employee });
    } catch {
      res.status(500).json({ error: "Błąd dodawania pracownika" });
    }
  }

  async updateEmployeeRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!["Pracownik", "Kierownik"].includes(role)) {
        return res.status(400).json({ error: "Nieprawidłowa rola" });
      }

      const employee = await employeesRepository.findById(id);
      if (!employee) {
        return res.status(404).json({ error: "Pracownik nie istnieje" });
      }

      employee.role = role as EmployeeRole;
      await employee.save();

      res.status(200).json({ message: "Rola zaktualizowana", employee });
    } catch {
      res.status(500).json({ error: "Błąd aktualizacji roli" });
    }
  }

  async removeEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const employee = await employeesRepository.findById(id);
      if (!employee) {
        return res.status(404).json({ error: "Pracownik nie istnieje" });
      }

      await employeesRepository.delete(id);
      res.status(200).json({ message: "Pracownik usunięty" });
    } catch {
      res.status(500).json({ error: "Błąd usuwania pracownika" });
    }
  }

  async resetUserPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password || password.length < 6) {
        return res.status(400).json({
          error: "Hasło musi mieć min. 6 znaków",
        });
      }

      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({
          error: "Użytkownik nie istnieje",
        });
      }

      await userRepository.updatePassword(id, password);

      res.json({
        message: "Hasło użytkownika zostało zresetowane",
      });
    } catch (err) {
      console.error("RESET PASSWORD ERROR:", err);
      res.status(500).json({
        error: "Błąd resetowania hasła",
      });
    }
  }
}

export const adminController = new AdminController();
