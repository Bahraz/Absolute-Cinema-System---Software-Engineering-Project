import type { Request, Response, NextFunction } from "express";
import { HttpError } from "@utils/httpError";
import { actorService } from "@services/actor.service";
import { employeesService } from "@services/employees.service";
import { userService } from "@services/user.service";
import { genreService } from "@services/genre.service";
import { hallService } from "@services/hall.service";
import { movieService } from "@services/movie.service";
import { screeningService } from "@services/screening.service";
import { reservationService } from "@services/reservation.service";

export class ViewController {
  home(req: Request, res: Response) {
    if (!req.user) {
      return res.redirect("/login");
    }

    if (req.user.employeeRole) {
      return res.redirect("/admin/dashboard");
    }

    return res.redirect("/user/dashboard");
  }

  login(req: Request, res: Response) {
    res.render("auth/login");
  }

  register(req: Request, res: Response) {
    res.render("auth/register");
  }

  logout(req: Request, res: Response) {
    res.render("auth/logout");
  }

  async adminActors(req: Request, res: Response, next: NextFunction) {
    try {
      const actors = await actorService.findAll();
      res.render("admin/actors", { actors });
    } catch (err) {
      next(err);
    }
  }

  async adminEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const employees = await employeesService.findAllWithUserNames();
      const users = await userService.findUsersWithoutEmployee();

      res.render("admin/employees", {
        employees,
        users,
      });
    } catch (err) {
      next(err);
    }
  }

  async adminGenres(req: Request, res: Response, next: NextFunction) {
    try {
      const genres = await genreService.findAll();
      res.render("admin/genres", { genres });
    } catch (err) {
      next(err);
    }
  }

  async adminHalls(req: Request, res: Response, next: NextFunction) {
    try {
      const halls = await hallService.findAll();
      res.render("admin/halls", { halls });
    } catch (err) {
      next(err);
    }
  }

  async adminHallDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const hall = await hallService.findById(req.params.id);

      if (!hall) {
        throw new HttpError(404, "Nie znaleziono sali", "HALL_NOT_FOUND");
      }

      const seats = await hallService.findSeats(hall._id.toString());

      res.render("admin/hall-details", { hall, seats });
    } catch (err) {
      next(err);
    }
  }

  async adminMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const movies = await movieService.getAllMovies();
      res.render("admin/movies", { movies });
    } catch (err) {
      next(err);
    }
  }

  async adminMovieDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const details = await movieService.getMovieDetails(req.params.id);

      if (!details) {
        throw new HttpError(404, "Nie znaleziono filmu", "MOVIE_NOT_FOUND");
      }

      const allActors = await movieService.getAllActors();
      const allGenres = await movieService.getAllGenres();

      res.render("admin/movie-details", {
        movie: details.movie,
        actors: details.actors,
        genres: details.genres,
        allActors,
        allGenres,
      });
    } catch (err) {
      next(err);
    }
  }

  async adminReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const { reservations, screenings } =
        await reservationService.getPanelData();

      res.render("admin/reservations", { reservations, screenings });
    } catch (err) {
      next(err);
    }
  }

  async adminScreenings(req: Request, res: Response, next: NextFunction) {
    try {
      const { screenings, movies, halls } =
        await screeningService.getPanelData();

      res.render("admin/screenings", { screenings, movies, halls });
    } catch (err) {
      next(err);
    }
  }

  async adminUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.render("admin/users", { users });
    } catch (err) {
      next(err);
    }
  }

  async userDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { screenings, movies, halls } =
        await screeningService.getUserPanelData();

      res.render("user/dashboard", { screenings, movies, halls });
    } catch (err) {
      next(err);
    }
  }

  async userProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user.id);
      const reservations = await userService.getMyReservations(req.user.id);

      res.render("user/my-profile", { user, reservations });
    } catch (err) {
      next(err);
    }
  }

  async userReservationPanel(req: Request, res: Response, next: NextFunction) {
    try {
      const { screenings } = await screeningService.getUserPanelData();
      res.render("user/reservation", { screenings });
    } catch (err) {
      next(err);
    }
  }

  async userMyReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationService.findByUserId(req.user.id);
      res.render("user/my-reservations", { reservations });
    } catch (err) {
      next(err);
    }
  }
}

export const viewController = new ViewController();
