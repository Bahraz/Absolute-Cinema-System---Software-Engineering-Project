import type { Request, Response, NextFunction } from "express";
import { userService } from "@services/user.service";
import { employeesService } from "@services/employees.service";
import { adminService } from "@services/admin.service";
import { HttpError } from "@utils/httpError";

export class AdminController {
  async dashboard(req: Request, res: Response) {
    res.status(200).json({
      message: "Panel administratora",
      admin: req.user,
    });
  }

  async dashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.dashboardStats();
      res.status(200).json(stats);
    } catch (err) {
      next(err);
    }
  }

  async getEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await adminService.getEmployees();
      res.status(200).json(employees);
    } catch (err) {
      next(err);
    }
  }

  async addEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.body;

      if (!userId || !role) {
        throw new HttpError(400, "Brak wymaganych pól", "MISSING_FIELDS");
      }

      const employee = await employeesService.addEmployee(userId, role);

      res.status(201).json({
        message: "Pracownik dodany",
        employee,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateEmployeeRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const updated = await employeesService.updateRole(id, role);

      res.status(200).json({
        message: "Rola zaktualizowana",
        employee: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async removeEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await employeesService.removeEmployee(id);

      res.status(200).json({
        message: "Pracownik usunięty",
      });
    } catch (err) {
      next(err);
    }
  }

  async resetUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password || password.length < 6) {
        throw new HttpError(
          400,
          "Hasło musi mieć min. 6 znaków",
          "INVALID_PASSWORD"
        );
      }

      const ok = await userService.updateUserPassword(id, password);

      if (!ok) {
        throw new HttpError(404, "Użytkownik nie istnieje", "USER_NOT_FOUND");
      }

      res.json({
        message: "Hasło użytkownika zostało zresetowane",
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
