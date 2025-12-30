import type { Request, Response } from "express";
import { authService } from "@services/auth.service";

export class AuthController {
  async register(req: Request, res: Response) {
    console.log("HEADERS:", req.headers["content-type"]);
    console.log("BODY:", req.body);

    try {
      const { name, surname, email, password } = req.body;

      if (!name || !surname || !email || !password) {
        return res.status(400).json({
          error: "name, surname, email i password są wymagane",
        });
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
      if (err instanceof Error && err.message === "EMAIL_EXISTS") {
        return res.status(409).json({
          error: "Użytkownik o takim emailu już istnieje",
        });
      }

      res.status(500).json({
        error: "Błąd rejestracji",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "email i password są wymagane",
        });
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
      if (err instanceof Error) {
        if (err.message === "INVALID_CREDENTIALS") {
          return res.status(401).json({
            error: "Nieprawidłowe dane logowania",
          });
        }

        // 🔒 BLOKADA KONTA
        if (err.message === "ACCOUNT_DISABLED") {
          return res.status(403).json({
            error: "Konto zostało dezaktywowane",
          });
        }
      }

      res.status(500).json({
        error: "Błąd logowania",
      });
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
