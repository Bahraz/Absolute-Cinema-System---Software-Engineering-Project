import type { Request, Response, NextFunction } from "express";

import { Actor } from "@models/actorModel";


export class ActorController {
    async showActors(req: Request, res: Response) {
        try {
            const actors = await Actor.find({}, "name surname");
            res.json(actors);
        }
        catch (err: unknown) {
            const error = err instanceof Error ? err.message : "Nieznany błąd";
            res.status(500).json({ error });
        }
    }


    async addActor(req: Request, res: Response) {
        try {
           const name =
                req.body?.name !== undefined
                    ? String(req.body.name).trim()
                    : undefined;
            const surname =
                req.body?.surname !== undefined
                    ? String(req.body.surname).trim()
                    : undefined;

            if (name === "" || surname === "") {
                return res.status(400).json({
                    error: "Pola 'imię' i 'nazwisko' nie mogą być puste.",
                });
            }

            if (!name || !surname) {
                return res.status(400).json({
                    error: "Pola 'imię' i 'nazwisko' są wymagane.",
                });
            }

            // lock for duplicates
            const exists = await Actor.findOne({
                name: name,
                surname: surname,
            });

            if (exists) {
                return res.status(409).json({ error: "Taki aktor już istnieje." });
            }

            const actor = await Actor.create({ name, surname });
            return res.status(201).json(actor);
        } catch (err: unknown) {
            const error = err instanceof Error ? err.message : "Nieznany błąd";
            return res.status(500).json({ error });
        }
    }


    async updateActorById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const name =
                req.body?.name !== undefined
                    ? String(req.body.name).trim()
                    : undefined;
            const surname =
                req.body?.surname !== undefined
                    ? String(req.body.surname).trim()
                    : undefined;

            if (name === "" || surname === "") {
                return res.status(400).json({
                    error: "Pola 'imię' i 'nazwisko' nie mogą być puste.",
                });
            }

            const update: Partial<{ name: string; surname: string }> = {};
            if (name !== undefined) update.name = name;
            if (surname !== undefined) update.surname = surname;

            if (Object.keys(update).length === 0) {
                return res.status(400).json({
                    error: "Brak danych do aktualizacji.",
                });
            }

            const actor = await Actor.findByIdAndUpdate(id, update, {
                new: true,
                runValidators: true,
            });

            if (!actor) {
                return res.status(404).json({
                    error: "Nie znaleziono aktora.",
                });
            }

            return res.json(actor);
        }
        catch (err: unknown) {
            const error = err instanceof Error ? err.message : "Nieznany błąd";
            return res.status(500).json({ error });
        }
    }


    async deleteActorById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const result = await Actor.findByIdAndDelete(id);
            if (!result) return res.status(404).json({ message: "Nie znaleziono aktora" })
            return res.sendStatus(204);
        } catch (err: unknown) {
            return res.status(500).json({ error: err instanceof Error ? err.message : "Nieznany błąd" });
        }
    }
}

export const actorController = new ActorController();