import type { Request, Response } from "express";
import { Hall } from "@models/hall";

export class HallController {
  // 1. Lista sal
  async show(req: Request, res: Response) {
    try {
      const halls = await Hall.find();
      res.status(200).json(halls);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania sal",
        details: err,
      });
    }
  }

  // 2. Dodaj salę
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Podaj nazwę sali",
        });
      }

      const newHall = new Hall({ name });
      const savedHall = await newHall.save();

      res.status(201).json(savedHall);
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania sali",
        details: err,
      });
    }
  }

  // 3. Edytuj salę
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Nazwa sali nie może być pusta",
        });
      }

      const updatedHall = await Hall.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );

      if (!updatedHall) {
        return res.status(404).json({
          error: "Nie znaleziono sali",
        });
      }

      res.status(200).json(updatedHall);
    } catch (err) {
      res.status(500).json({
        error: "Błąd edycji sali",
        details: err,
      });
    }
  }

  // 4. Usuń salę
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedHall = await Hall.findByIdAndDelete(id);

      if (!deletedHall) {
        return res.status(404).json({
          error: "Nie znaleziono sali",
        });
      }

      res.status(200).json({
        message: "Sala została usunięta",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania sali",
        details: err,
      });
    }
  }
}

export const hallController = new HallController();
