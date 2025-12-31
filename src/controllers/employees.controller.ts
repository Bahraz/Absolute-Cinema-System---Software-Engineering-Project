import type { Request, Response, NextFunction } from "express";
import { employeesService } from "@services/employees.service";
import { userService } from "@services/user.service";
import { HttpError } from "@utils/httpError";

export class EmployeesController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await employeesService.findAllWithUserNames();
      res.json(employees);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, role } = req.body;

      if (!user_id || !role) {
        throw new HttpError(
          400,
          "user_id oraz rola są wymagane",
          "MISSING_FIELDS"
        );
      }

      const employee = await employeesService.addEmployee(user_id, role);
      res.status(201).json(employee);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.body;

      const updated = await employeesService.updateRole(
        req.params.id,
        role
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await employeesService.removeEmployee(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export const employeesController = new EmployeesController();
