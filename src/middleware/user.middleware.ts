import { Request, Response, NextFunction } from "express";

export const userOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "USER") {
    return res.status(403).json({ error: "Brak dostępu (USER)" });
  }

  next();
};
