import type { Request, Response } from "express";
import { Movie } from "@models/movieModel";
import { MovieActor } from "@models/movieActorModel";
import { MovieGenre } from "@models/movieGenreModel";
import { Actor } from "@models/actorModel";
import { Genre } from "@models/genreModel";

export class MoviesController {
  // === GET ALL ===
async getAll(req: Request, res: Response) {
  try {
    const movies = await Movie.find();

    const moviesWithDetails = await Promise.all(
      movies.map(async movie => {
        // Pobranie aktorów
        const actors = await MovieActor.find({ movie_id: movie._id })
          .populate<{ actor_id: { _id: string; name: string; surname: string } }>(
            "actor_id",
            "name surname"
          )
          .exec();

        // Pobranie gatunków
        const genres = await MovieGenre.find({ movie_id: movie._id })
          .populate<{ genre_id: { _id: string; name: string } }>(
            "genre_id",
            "name"
          )
          .exec();

        return {
          _id: movie._id,
          title: movie.title,
          duration: movie.duration,
          release_year: movie.release_year,
          actors: actors.map(a => ({
            _id: a.actor_id._id,
            name: a.actor_id.name,
            surname: a.actor_id.surname,
          })),
          genres: genres.map(g => ({
            _id: g.genre_id._id,
            name: g.genre_id.name,
          })),
        };
      })
    );

    res.status(200).json(moviesWithDetails);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Nieznany błąd",
    });
  }
}

  // === GET ONE WITH ACTORS + GENRES ===
  async getOne(req: Request, res: Response) {
    try {
      const { movie_id } = req.params;

      const movie = await Movie.findById(movie_id);
      if (!movie) return res.status(404).json({ error: "Film nie znaleziony" });

      // Aktorzy powiązani z filmem
      const movieActors = await MovieActor.find({ movie_id: movie_id }).populate("actor_id");
      const actors = movieActors.map((ma) => ma.actor_id);

      // Gatunki powiązane z filmem
      const movieGenres = await MovieGenre.find({ movie_id: movie_id }).populate("genre_id");
      const genres = movieGenres.map((mg) => mg.genre_id);

      res.json({ movie, actors, genres });
    } catch (err) {
      res.status(500).json({ error: "Błąd pobierania filmu" });
    }
  }

  // === CREATE MOVIE ===
  async create(req: Request, res: Response) {
    try {
      const { title, duration, release_year } = req.body;

      const movie = new Movie({
        title,
        duration,
        release_year,
      });

      await movie.save();
      res.status(201).json(movie);
    } catch (err) {
      res.status(500).json({ error: "Nie udało się utworzyć filmu" });
    }
  }

  // === UPDATE MOVIE ===
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updated = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updated) return res.status(404).json({ error: "Film nie znaleziony" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Błąd aktualizacji filmu" });
    }
  }

  // === DELETE MOVIE ===
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await Movie.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Film nie znaleziony" });

      // Usuwamy relacje
      await MovieActor.deleteMany({ movie_id: id });
      await MovieGenre.deleteMany({ movie_id: id });

      res.json({ message: "Film i jego relacje zostały usunięte" });
    } catch (err) {
      res.status(500).json({ error: "Błąd usuwania filmu" });
    }
  }

  // === ADD ACTOR TO MOVIE ===
  async addActor(req: Request, res: Response) {
    try {
      const { movie_id, actor_id } = req.body;

      // Czy film istnieje?
      const movie = await Movie.findById(movie_id);
      if (!movie) return res.status(404).json({ error: "Film nie istnieje" });

      // Czy aktor istnieje?
      const actor = await Actor.findById(actor_id);
      if (!actor) return res.status(404).json({ error: "Aktor nie istnieje" });

      const rel = new MovieActor({ movie_id, actor_id });
      await rel.save();

      res.status(201).json({ message: "Aktor dodany do filmu" });
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Ten aktor jest już przypisany do filmu" });
      }
      res.status(500).json({ error: "Błąd dodawania aktora do filmu" });
    }
  }

  // === ADD GENRE TO MOVIE ===
  async addGenre(req: Request, res: Response) {
    try {
      const { movie_id, genre_id } = req.body;

      const movie = await Movie.findById(movie_id);
      if (!movie) return res.status(404).json({ error: "Film nie istnieje" });

      const genre = await Genre.findById(genre_id);
      if (!genre) return res.status(404).json({ error: "Gatunek nie istnieje" });

      const rel = new MovieGenre({ movie_id, genre_id });
      await rel.save();

      res.status(201).json({ message: "Gatunek dodany do filmu" });
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Ten gatunek jest już przypisany do filmu" });
      }
      res.status(500).json({ error: "Błąd dodawania gatunku do filmu" });
    }
  }
}

export const moviesController = new MoviesController();
