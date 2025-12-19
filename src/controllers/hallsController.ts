import type { Request, Response } from "express";
import { Hall } from "@models/hallModel";

export class HallsController {
  // GET /halls
  async show(req: Request, res: Response) {
    try {
      const halls = await Hall.find({}, "name");
      res.status(200).json(halls);
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // POST /halls
  async add(req: Request, res: Response) {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Pole 'name' jest wymagane" });
    }

    try {
      const hall = new Hall({ name: name.trim() });
      await hall.save();

      res.status(201).json(hall);
    } catch (err: unknown) {
      res.status(422).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // PUT /halls/:id
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Pole 'name' jest wymagane" });
    }

    try {
      const updated = await Hall.findByIdAndUpdate(
        id,
        { name: name.trim() },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Sala nie została znaleziona" });
      }

      res.status(200).json({
        message: "Sala zaktualizowana pomyślnie",
        hall: updated,
      });
    } catch (err: unknown) {
      res.status(422).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // DELETE /halls/:id
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deleted = await Hall.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Sala nie została znaleziona" });
      }

      res.status(200).json({ message: "Sala usunięta pomyślnie" });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
}

export const hallsController = new HallsController();
