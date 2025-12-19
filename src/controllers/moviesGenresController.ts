import type { Request, Response } from "express";
import { MovieGenre } from "@models/movieGenreModel";
import { Movie } from "@models/movieModel";
import { Genre } from "@models/genreModel";

export class MoviesGenresController {
  // POST /movie-genres
  async add(req: Request, res: Response) {
    const { movie_id, genre_id } = req.body;

    if (!movie_id || !genre_id) {
      return res.status(400).json({ error: "movie_id i genre_id są wymagane" });
    }

    try {
      // sprawdzamy czy istnieją
      const movieExists = await Movie.exists({ _id: movie_id });
      const genreExists = await Genre.exists({ _id: genre_id });

      if (!movieExists)
        return res.status(404).json({ error: "Film nie istnieje" });
      if (!genreExists)
        return res.status(404).json({ error: "Gatunek nie istnieje" });

      // sprawdzamy czy powiązanie już istnieje
      const exists = await MovieGenre.findOne({ movie_id, genre_id });
      if (exists) {
        return res
          .status(409)
          .json({ error: "Gatunek jest już przypisany do filmu" });
      }

      const link = new MovieGenre({ movie_id, genre_id });
      await link.save();

      res.status(201).json({
        message: "Gatunek dodano do filmu",
        link,
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // GET /movie-genres/:movie_id
  async getGenresForMovie(req: Request, res: Response) {
    const { movie_id } = req.params;

    try {
      const genres = await MovieGenre.find({ movie_id }).populate(
        "genre_id",
        "name"
      );

      res.status(200).json(genres.map((g) => g.genre_id));
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // GET /genre-movies/:genre_id
  async getMoviesForGenre(req: Request, res: Response) {
    const { genre_id } = req.params;

    try {
      const movies = await MovieGenre.find({ genre_id }).populate(
        "movie_id",
        "title year"
      );

      res.status(200).json(movies.map((m) => m.movie_id));
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // DELETE /movie-genres
  async delete(req: Request, res: Response) {
    const { movie_id, genre_id } = req.body;

    if (!movie_id || !genre_id) {
      return res.status(400).json({
        error: "movie_id i genre_id są wymagane",
      });
    }

    try {
      const deleted = await MovieGenre.findOneAndDelete({
        movie_id,
        genre_id,
      });

      if (!deleted) {
        return res.status(404).json({
          error: "Powiązanie film-gatunek nie istnieje",
        });
      }

      res.status(200).json({
        message: "Gatunek usunięto z filmu",
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
}

export const moviesGenresController = new MoviesGenresController();
