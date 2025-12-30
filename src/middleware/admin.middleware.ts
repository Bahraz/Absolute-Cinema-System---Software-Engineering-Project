import { Request, Response, NextFunction } from "express";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Brak dostępu (ADMIN)" });
  }

  next();
};
