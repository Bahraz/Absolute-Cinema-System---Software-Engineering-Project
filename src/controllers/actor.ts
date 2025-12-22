import type { Request, Response } from "express";
import { Actor } from "@models/actor";

export class ActorController {

  // 1. Lista aktorów
  async show(req: Request, res: Response) {
    try {
      const actors = await Actor.find();
      res.status(200).json(actors);
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania aktorów", details: err });
    }
  }

  // 2. Dodaj aktora
  async create(req: Request, res: Response) {
    try {
      const { name, surname } = req.body;
      if (!name || !surname) {
        return res.status(400).json({ error: "Podaj imię i nazwisko aktora" });
      }

      const newActor = new Actor({ name, surname });
      const savedActor = await newActor.save();

      res.status(201).json(savedActor);
    } catch (err) {
      res.status(500).json({ error: "Błąd dodawania aktora", details: err });
    }
  }

  // 3. Edytuj aktora
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, surname } = req.body;

      const updatedActor = await Actor.findByIdAndUpdate(
        id,
        { name, surname },
        { new: true, runValidators: true }
      );

      if (!updatedActor) {
        return res.status(404).json({ error: "Nie znaleziono aktora" });
      }

      res.status(200).json(updatedActor);
    } catch (err) {
      res.status(500).json({ error: "Błąd edycji aktora", details: err });
    }
  }

  // 4. Usuń aktora
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedActor = await Actor.findByIdAndDelete(id);

      if (!deletedActor) {
        return res.status(404).json({ error: "Nie znaleziono aktora" });
      }

      res.status(200).json({ message: "Aktor został usunięty" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania aktora", details: err });
    }
  }
}

export const actorController = new ActorController();
