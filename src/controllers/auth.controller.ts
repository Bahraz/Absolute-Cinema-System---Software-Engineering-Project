import type { Request, Response, NextFunction } from "express";
import { authService } from "@services/auth.service";
import { HttpError } from "@utils/httpError";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, surname, email, password } = req.body;

      if (!name || !surname || !email || !password) {
        throw new HttpError(
          400,
          "name, surname, email i password są wymagane",
          "MISSING_FIELDS"
        );
      }

      const user = await authService.register({
        name,
        surname,
        email,
        password,
      });

      res.status(201).json({
        message: "Rejestracja zakończona sukcesem",
        id: user._id,
        email: user.email,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new HttpError(
          400,
          "email i password są wymagane",
          "MISSING_FIELDS"
        );
      }

      const user = await authService.login(email, password);

      // 🔐 zapis do sesji
      req.session.user = {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      };

      // 🔀 redirect wg roli
      const redirect =
        user.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";

      res.status(200).json({
        message: "Zalogowano pomyślnie",
        redirect,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response) {
    req.session.destroy(() => {
      res.clearCookie("sid");
      res.sendStatus(204);
    });
  }
}

export const authController = new AuthController();
