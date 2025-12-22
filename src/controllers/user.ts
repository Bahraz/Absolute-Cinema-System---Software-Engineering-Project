import type { Request, Response } from "express";
import { User } from "@models/user";

export class UserController {

  // 1. Lista użytkowników
  async show(req: Request, res: Response) {
    try {
      const users = await User.find().select("-password");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania użytkowników",
        details: err,
      });
    }
  }

  // 2. Dodaj użytkownika
  async create(req: Request, res: Response) {
    try {
      const { name, surname, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Imię, email i hasło są wymagane",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: "Użytkownik z takim emailem już istnieje",
        });
      }

      const newUser = new User({ name, surname, email, password });
      const savedUser = await newUser.save();

      res.status(201).json({
        id: savedUser._id,
        name: savedUser.name,
        surname: savedUser.surname,
        email: savedUser.email,
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania użytkownika",
        details: err,
      });
    }
  }

  // 3. Edytuj użytkownika (BEZ hasła)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, surname, email } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, surname, email },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          error: "Nie znaleziono użytkownika",
        });
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({
        error: "Błąd edycji użytkownika",
        details: err,
      });
    }
  }

  // 4. Usuń użytkownika
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({
          error: "Nie znaleziono użytkownika",
        });
      }

      res.status(200).json({
        message: "Użytkownik został usunięty",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania użytkownika",
        details: err,
      });
    }
  }
}

export const userController = new UserController();
