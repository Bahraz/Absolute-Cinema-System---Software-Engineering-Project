import { Request, Response, NextFunction } from "express";
import { Employees } from "@models/employees.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const user = req.session.user;

  const employee = await Employees.findOne({ user_id: user.id }).lean();

  req.user = {
    ...user,
    employeeRole: employee ? employee.role : null,
  };

  next();
};
