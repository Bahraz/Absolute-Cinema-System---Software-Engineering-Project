import type { Request, Response } from "express";
import { Movie } from "@models/movie";
import { Actor } from "@models/actor";
import { MovieActor } from "@models/moviesActors";
import { Genre } from "@models/genre";
import { MovieGenre } from "@models/moviesGenres";

export class MovieController {
  // 1. Lista filmów
  async show(req: Request, res: Response) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania filmów",
        details: err,
      });
    }
  }

  // 2. Dodaj film
  async create(req: Request, res: Response) {
    try {
      const { title, duration, release_year, description } = req.body;

      // Walidacja
      if (!title || !duration || !release_year || !description) {
        return res.status(400).json({
          error: "Wszystkie pola są wymagane",
        });
      }

      const newMovie = new Movie({
        title,
        duration,
        release_year,
        description,
      });

      const savedMovie = await newMovie.save();

      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json({
        error: "Błąd dodawania filmu",
        details: err,
      });
    }
  }

  // 3. Edytuj film
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, duration, release_year, description } = req.body;

      if (!title || !duration || !release_year || !description) {
        return res.status(400).json({
          error: "Wszystkie pola są wymagane",
        });
      }

      const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        { title, duration, release_year, description },
        { new: true, runValidators: true }
      );

      if (!updatedMovie) {
        return res.status(404).json({
          error: "Nie znaleziono filmu",
        });
      }

      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json({
        error: "Błąd edycji filmu",
        details: err,
      });
    }
  }

  // 4. Usuń film
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({
          error: "Nie znaleziono filmu",
        });
      }

      // 🧹 usuń relacje
      await MovieActor.deleteMany({ movie_id: id });
      await MovieGenre.deleteMany({ movie_id: id });

      // 🎬 usuń film
      await Movie.findByIdAndDelete(id);

      res.status(200).json({
        message: "Film oraz wszystkie relacje zostały usunięte",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania filmu",
        details: err,
      });
    }
  }

  async addActorMovie(req: Request, res: Response) {
    try {
      const { movieId } = req.params;
      const { actorId } = req.body;

      if (!actorId) {
        return res.status(400).json({ error: "Brak actorId" });
      }

      // sprawdź czy film istnieje
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: "Nie znaleziono filmu" });
      }

      // sprawdź czy aktor istnieje
      const actor = await Actor.findById(actorId);
      if (!actor) {
        return res.status(404).json({ error: "Nie znaleziono aktora" });
      }

      // zapis relacji
      const relation = new MovieActor({
        movie_id: movieId,
        actor_id: actorId,
      });

      await relation.save();

      res.status(201).json({
        message: "Aktor został dodany do filmu",
      });
    } catch (err: any) {
      // duplikat (index unique)
      if (err.code === 11000) {
        return res.status(400).json({
          error: "Aktor jest już przypisany do filmu",
        });
      }

      res.status(500).json({
        error: "Błąd dodawania aktora do filmu",
        details: err,
      });
    }
  }

  async getActorsByMovie(req: Request, res: Response) {
    try {
      const { movieId } = req.params;

      const relations = await MovieActor.find({ movie_id: movieId }).populate(
        "actor_id",
        "name surname"
      );

      const actors = relations.map((r) => ({
        id: (r.actor_id as any)._id.toString(),
        name: (r.actor_id as any).name,
        surname: (r.actor_id as any).surname,
      }));

      res.status(200).json(actors);
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania aktorów filmu",
        details: err,
      });
    }
  }

  async removeActorMovie(req: Request, res: Response) {
    try {
      const { movieId, actorId } = req.params;

      const result = await MovieActor.findOneAndDelete({
        movie_id: movieId,
        actor_id: actorId,
      });

      if (!result) {
        return res.status(404).json({
          error: "Relacja film–aktor nie istnieje",
        });
      }

      res.status(200).json({
        message: "Aktor został usunięty z filmu",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania aktora z filmu",
        details: err,
      });
    }
  }

  async addGenreMovie(req: Request, res: Response) {
    try {
      const { movieId } = req.params;
      const { genreId } = req.body;

      if (!genreId) {
        return res.status(400).json({ error: "Brak genreId" });
      }

      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: "Nie znaleziono filmu" });
      }

      const genre = await Genre.findById(genreId);
      if (!genre) {
        return res.status(404).json({ error: "Nie znaleziono gatunku" });
      }

      const relation = new MovieGenre({
        movie_id: movieId,
        genre_id: genreId,
      });

      await relation.save();

      res.status(201).json({
        message: "Gatunek został dodany do filmu",
      });
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(400).json({
          error: "Gatunek jest już przypisany do filmu",
        });
      }

      res.status(500).json({
        error: "Błąd dodawania gatunku do filmu",
        details: err,
      });
    }
  }

  async getGenresByMovie(req: Request, res: Response) {
  try {
    const { movieId } = req.params;

    const relations = await MovieGenre.find({ movie_id: movieId })
      .populate("genre_id", "name");

    const genres = relations.map(r => ({
      id: (r.genre_id as any)._id.toString(),
      name: (r.genre_id as any).name,
    }));

    res.status(200).json(genres);
  } catch (err) {
    res.status(500).json({
      error: "Błąd pobierania gatunków filmu",
      details: err,
    });
  }
}

  async removeGenreMovie(req: Request, res: Response) {
    try {
      const { movieId, genreId } = req.params;

      const result = await MovieGenre.findOneAndDelete({
        movie_id: movieId,
        genre_id: genreId,
      });

      if (!result) {
        return res.status(404).json({
          error: "Relacja film–gatunek nie istnieje",
        });
      }

      res.status(200).json({
        message: "Gatunek został usunięty z filmu",
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd usuwania gatunku z filmu",
        details: err,
      });
    }
  }

  async movieDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ error: "Nie znaleziono filmu" });
      }

      const actors = await MovieActor.find({ movie_id: id })
        .populate("actor_id", "name surname")
        .select("-_id actor_id");

      const genres = await MovieGenre.find({ movie_id: id })
        .populate("genre_id", "name")
        .select("-_id genre_id");

      res.status(200).json({
        movie,
        actors: actors.map((a) => a.actor_id),
        genres: genres.map((g) => g.genre_id),
      });
    } catch (err) {
      res.status(500).json({
        error: "Błąd pobierania szczegółów filmu",
        details: err,
      });
    }
  }
}

export const movieController = new MovieController();
