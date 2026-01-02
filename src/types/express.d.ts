import "express";
import { UserRole } from "@services/auth.service";
import { EmployeeRole } from "@models/employees.model";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        email: string;
        name: string;
        employeeRole?: EmployeeRole | null;
      };
    }
  }
}

export {};