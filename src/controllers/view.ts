import type { Request, Response } from "express";
import { Movie } from "@models/movie";
import { Genre } from "@models/genre";
import { MovieGenre } from "@models/moviesGenres";
import { Actor } from "@models/actor";
import { MovieActor } from "@models/moviesActors";
import { Hall } from "@models/hall";
import { Seat } from "@models/seat";
import { Screening } from "@models/screening";
import { User } from "@models/user";
import { Employees } from "@models/employees";
import { Payment } from "@models/payment";
import { Ticket } from "@models/ticket";
import { Reservation } from "@models/reservation";
export class ViewController {
  home(req: Request, res: Response) {
    res.render("home");
  }

  user(req: Request, res: Response) {
    res.render("user");
  }

  adminPanel(req: Request, res: Response) {
    res.render("admin");
  }

  async actorsPanelView(req: Request, res: Response) {
    try {
      const actors = await Actor.find();

      const actorsView = actors.map((actor) => ({
        id: actor._id.toString(),
        name: actor.name,
        surname: actor.surname,
      }));

      res.render("actors", { actors: actorsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  async actorsList(req: Request, res: Response) {
    try {
      const actors = await Actor.find();

      const actorsView = actors.map((actor) => ({
        id: actor._id.toString(),
        name: actor.name,
        surname: actor.surname,
      }));

      res.render("actorsList", { actors: actorsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
  async moviesPanelView(req: Request, res: Response) {
    try {
      // 🔹 filmy
      const movies = await Movie.find();
      const moviesView = movies.map((movie) => ({
        id: movie._id.toString(),
        title: movie.title,
        duration: movie.duration,
        release_year: movie.release_year,
        description: movie.description,
      }));

      // 🔹 aktorzy (do selecta)
      const actors = await Actor.find();
      const actorsView = actors.map((actor) => ({
        id: actor._id.toString(),
        name: actor.name,
        surname: actor.surname,
      }));

      // 🔹 gatunki (do selecta)
      const genres = await Genre.find();
      const genresView = genres.map((genre) => ({
        id: genre._id.toString(),
        name: genre.name,
      }));

      res.render("movies", {
        movies: moviesView,
        actors: actorsView,
        genres: genresView,
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // Lista filmów (np. publiczna / admin)
  async moviesList(req: Request, res: Response) {
    try {
      const movies = await Movie.find();

      const moviesView = movies.map((movie) => ({
        id: movie._id.toString(),
        title: movie.title,
        duration: movie.duration,
        release_year: movie.release_year,
        description: movie.description,
      }));

      res.render("moviesList", { movies: moviesView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  async moviesDetails(req: Request, res: Response) {
    try {
      const { id: movieId } = req.params; // ← TUTAJ ZMIANA

      if (!movieId) {
        return res.redirect("/movies");
      }

      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).render("404", {
          message: "Nie znaleziono filmu",
        });
      }

      const actorsRelations = await MovieActor.find({
        movie_id: movieId,
      }).populate("actor_id");

      const actors = actorsRelations.map((r) => ({
        id: (r.actor_id as any)._id.toString(),
        name: (r.actor_id as any).name,
        surname: (r.actor_id as any).surname,
      }));

      const genresRelations = await MovieGenre.find({
        movie_id: movieId,
      }).populate("genre_id");

      const genres = genresRelations.map((r) => ({
        id: (r.genre_id as any)._id.toString(),
        name: (r.genre_id as any).name,
      }));

      res.render("movieDetails", {
        movie: {
          id: movie._id.toString(),
          title: movie.title,
          duration: movie.duration,
          release_year: movie.release_year,
          description: movie.description,
        },
        actors,
        genres,
      });
    } catch (err: unknown) {
      res.status(500).render("500", {
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // Panel zarządzania gatunkami (admin)
  async genresPanelView(req: Request, res: Response) {
    try {
      const genres = await Genre.find();

      const genresView = genres.map((genre) => ({
        id: genre._id.toString(),
        name: genre.name,
      }));

      res.render("genres", { genres: genresView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // Lista gatunków (publiczna / admin)
  async genresList(req: Request, res: Response) {
    try {
      const genres = await Genre.find();

      const genresView = genres.map((genre) => ({
        id: genre._id.toString(),
        name: genre.name,
      }));

      res.render("genresList", { genres: genresView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  async hallsPanelView(req: Request, res: Response) {
    try {
      const halls = await Hall.find();

      const hallsView = halls.map((hall) => ({
        id: hall._id.toString(),
        name: hall.name,
      }));

      res.render("halls", { halls: hallsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // Lista sal
  async hallsList(req: Request, res: Response) {
    try {
      const halls = await Hall.find();

      const hallsView = halls.map((hall) => ({
        id: hall._id.toString(),
        name: hall.name,
      }));

      res.render("hallsList", { halls: hallsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // Panel admina
  async employeesPanelView(req: Request, res: Response) {
    try {
      // 🔹 pracownicy
      const employees = await Employees.find().populate("user_id");

      const employeesView = employees.map((emp) => ({
        id: emp._id.toString(),
        role: emp.role,
        user: emp.user_id
          ? {
              id: (emp.user_id as any)._id.toString(),
              name: (emp.user_id as any).name,
              surname: (emp.user_id as any).surname,
              email: (emp.user_id as any).email,
            }
          : null,
      }));

      // 🔹 użytkownicy (do selecta)
      const users = await User.find();

      const usersView = users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        surname: u.surname,
        email: u.email,
      }));

      res.render("employees", {
        employees: employeesView,
        users: usersView,
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // Lista pracowników
  async employeesList(req: Request, res: Response) {
    try {
      const employees = await Employees.find().populate("user_id");

      const employeesView = employees.map((emp) => ({
        id: emp._id.toString(),
        role: emp.role,
        user: emp.user_id
          ? {
              name: (emp.user_id as any).name,
              surname: (emp.user_id as any).surname,
              email: (emp.user_id as any).email,
            }
          : null,
      }));

      res.render("employeesList", { employees: employeesView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  async usersPanelView(req: Request, res: Response) {
    try {
      const users = await User.find();

      const usersView = users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));

      res.render("users", { users: usersView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  async usersList(req: Request, res: Response) {
    try {
      const users = await User.find();

      const usersView = users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        email: user.email,
      }));

      res.render("usersList", { users: usersView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // 🛠️ Panel administracyjny seansów
  async screeningsPanelView(req: Request, res: Response) {
    try {
      // 🔹 seanse
      const screenings = await Screening.find()
        .populate("movie_id")
        .populate("hall_id")
        .sort({ start_at: 1 });

      const screeningsView = screenings.map((s) => ({
        id: s._id.toString(),
        startAt: s.start_at,
        movie: {
          id: (s.movie_id as any)._id.toString(),
          title: (s.movie_id as any).title,
        },
        hall: {
          id: (s.hall_id as any)._id.toString(),
          name: (s.hall_id as any).name,
        },
      }));

      // 🔹 filmy
      const movies = await Movie.find();
      const moviesView = movies.map((m) => ({
        id: m._id.toString(),
        title: m.title,
      }));

      // 🔹 sale
      const halls = await Hall.find();
      const hallsView = halls.map((h) => ({
        id: h._id.toString(),
        name: h.name,
      }));

      // ✅ TERAZ EJS MA WSZYSTKO
      res.render("screenings", {
        screenings: screeningsView,
        movies: moviesView,
        halls: hallsView,
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // 📋 Lista seansów (np. publiczna)
  async screeningsList(req: Request, res: Response) {
    try {
      const screenings = await Screening.find()
        .populate("movie_id")
        .populate("hall_id")
        .sort({ start_at: 1 });

      const screeningsView = screenings.map((screening) => ({
        id: screening._id.toString(),
        startAt: screening.start_at,
        movieTitle: (screening.movie_id as any)?.title ?? "Brak filmu",
        hallName: (screening.hall_id as any)?.name ?? "Brak sali",
      }));

      res.render("screeningsList", { screenings: screeningsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  async seatsPanelView(req: Request, res: Response) {
    try {
      const seats = await Seat.find().populate("hall_id");

      const seatsView = seats.map((s) => ({
        id: s._id.toString(),
        row: s.row,
        seatNumber: s.seat_number,
        hall: {
          id: (s.hall_id as any)._id.toString(),
          name: (s.hall_id as any).name,
        },
      }));

      const halls = await Hall.find();
      const hallsView = halls.map((h) => ({
        id: h._id.toString(),
        name: h.name,
      }));

      res.render("seats", {
        seats: seatsView,
        halls: hallsView,
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  // lista
  async seatsList(req: Request, res: Response) {
    try {
      // 🔹 miejsca
      const seats = await Seat.find().populate("hall_id");

      const seatsView = seats.map((s) => ({
        id: s._id.toString(),
        hallId: (s.hall_id as any)._id.toString(),
        row: s.row,
        seatNumber: s.seat_number,
      }));

      // 🔹 sale (TEGO BRAKOWAŁO)
      const halls = await Hall.find();

      const hallsView = halls.map((h) => ({
        id: h._id.toString(),
        name: h.name,
      }));

      // ✅ przekazujemy OBA
      res.render("seatsList", {
        seats: seatsView,
        halls: hallsView,
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
  async ticketsPanelView(req: Request, res: Response) {
    try {
      const tickets = await Ticket.find();

      const ticketsView = tickets.map((t) => ({
        id: t._id.toString(),
        status: t.status,
        amount: t.amount,
        expiresAt: t.expires_at,
        payment: t.payment_id
          ? {
              id: (t.payment_id as any)._id.toString(),
              provider: (t.payment_id as any).provider,
              status: (t.payment_id as any).status,
            }
          : null,
      }));

      res.render("tickets", { tickets: ticketsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
  async ticketsList(req: Request, res: Response) {
    try {
      const tickets = await Ticket.find().populate("payment_id");

      const ticketsView = tickets.map((t) => ({
        id: t._id.toString(),
        status: t.status,
        amount: t.amount,
        expiresAt: t.expires_at,
      }));

      res.render("ticketsList", { tickets: ticketsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
  async paymentsPanelView(req: Request, res: Response) {
    try {
      const payments = await Payment.find();

      const paymentsView = payments.map((p) => ({
        id: p._id.toString(),
        status: p.status,
        provider: p.provider,
      }));

      res.render("payments", { payments: paymentsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
  async paymentsList(req: Request, res: Response) {
    try {
      const payments = await Payment.find();

      const paymentsView = payments.map((p) => ({
        id: p._id.toString(),
        status: p.status,
        provider: p.provider,
      }));

      res.render("paymentsList", { payments: paymentsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

async reservationsPanelView(req: Request, res: Response) {
  try {
    // =========================
    // 🔹 REZERWACJE
    // =========================
    const reservations = await Reservation.find()
      .populate("user_id")
      .populate({
        path: "screening_id",
        populate: { path: "movie_id hall_id" },
      })
      .populate("seats_id")
      .populate("ticket_id")
      .lean();

    const reservationsView = reservations.map((r: any) => ({
      id: r._id.toString(),

      // 👤 użytkownik
      userId: r.user_id?._id?.toString() ?? null,
      userName: r.user_id
        ? `${r.user_id.name} ${r.user_id.surname}`
        : "—",
      userEmail: r.user_id?.email ?? "—",

      // 🎬 seans
      screeningId: r.screening_id?._id?.toString() ?? null,
      startAt: r.screening_id?.start_at ?? null,
      movieTitle: r.screening_id?.movie_id?.title ?? "—",
      hallName: r.screening_id?.hall_id?.name ?? "—",

      // 💺 miejsce
      seatId: r.seats_id?._id?.toString() ?? null,
      row: r.seats_id?.row ?? "—",
      seatNumber: r.seats_id?.seat_number ?? "—",

      // 🎟️ bilet
      ticketStatus: r.ticket_id?.status ?? "—",
    }));

    // =========================
    // 🔹 UŻYTKOWNICY (select)
    // =========================
    const users = await User.find().lean();
    const usersView = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      surname: u.surname,
      email: u.email,
    }));

    // =========================
    // 🔹 SEANSE (select)
    // =========================
    const screenings = await Screening.find()
      .populate("movie_id")
      .populate("hall_id")
      .sort({ start_at: 1 })
      .lean();

    const screeningsView = screenings.map((s: any) => ({
      id: s._id.toString(),
      startAt: s.start_at,
      movieTitle: s.movie_id?.title ?? "—",

      // 🔑 KLUCZOWE DLA FRONTENDU
      hallId: s.hall_id?._id?.toString() ?? null,
      hallName: s.hall_id?.name ?? "—",
    }));

    // =========================
    // ✅ RENDER
    // =========================
    res.render("reservations", {
      reservations: reservationsView,
      users: usersView,
      screenings: screeningsView,
    });
  } catch (err: unknown) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Nieznany błąd",
    });
  }
}


  async reservationsList(req: Request, res: Response) {
    try {
      const reservations = await Reservation.find();

      const reservationsView = reservations.map((r) => ({
        id: r._id.toString(),
        userId: r.user_id.toString(),
        screeningId: r.screening_id.toString(),
        ticketId: r.ticket_id.toString(),
        seatId: r.seats_id.toString(),
      }));

      res.render("reservationsList", { reservations: reservationsView });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }

  async reservationEditView(req: Request, res: Response) {
    try {
      // 🔹 rezerwacje (do wyboru)
      const reservations = await Reservation.find();

      const reservationsView = reservations.map((r) => ({
        id: r._id.toString(),
      }));

      // 🔹 seanse
      const screenings = await Screening.find()
        .populate("movie_id")
        .sort({ start_at: 1 });

      const screeningsView = screenings.map((s) => ({
        id: s._id.toString(),
        startAt: s.start_at,
        movieTitle: (s.movie_id as any)?.title ?? "—",
      }));

      res.render("reservationEdit", {
        reservations: reservationsView,
        screenings: screeningsView,
      });
    } catch (err: unknown) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "Nieznany błąd",
      });
    }
  }
}

export const viewController = new ViewController();
