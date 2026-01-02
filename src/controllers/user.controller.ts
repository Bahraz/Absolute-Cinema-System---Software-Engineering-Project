import type { Request, Response, NextFunction } from "express";
import { userService } from "@services/user.service";
import { HttpError } from "@utils/httpError";

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, surname, email } = req.body;

      if (!name && !surname && !email) {
        throw new HttpError(
          400,
          "Brak danych do aktualizacji",
          "MISSING_FIELDS"
        );
      }

      const user = await userService.updateUser(req.params.id, {
        name,
        surname,
        email,
      });

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deactivateUser(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.toggleUserActive(req.params.id);

      res.json({ is_active: user.is_active });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getScreenings(req: Request, res: Response, next: NextFunction) {
    try {
      const screenings = await userService.getScreenings();
      res.json(screenings);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, surname, email } = req.body;

      if (!name && !surname && !email) {
        throw new HttpError(
          400,
          "Brak danych do aktualizacji",
          "MISSING_FIELDS"
        );
      }

      const user = await userService.updateUser(req.user.id, {
        name,
        surname,
        email,
      });

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;

      if (!password || password.length < 6) {
        throw new HttpError(
          400,
          "Hasło musi mieć min. 6 znaków",
          "INVALID_PASSWORD"
        );
      }

      await userService.updateUserPassword(req.user.id, password);

      res.json({ message: "Hasło zmienione" });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
