export class HttpError extends Error {
  public status: number;
  public code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const wrapServiceError = (err: any): HttpError => {
  if (err instanceof HttpError) return err;

  // map known service error codes/messages to HttpError
  switch (err.message) {
    case "MISSING_FIELDS":
      return new HttpError(400, "Brak wymaganych pól", "MISSING_FIELDS");
    case "MISSING_PROVIDER":
      return new HttpError(400, "Provider jest wymagany", "MISSING_PROVIDER");
    case "INVALID_ROLE":
      return new HttpError(400, "Nieprawidłowa rola", "INVALID_ROLE");
    case "USER_NOT_FOUND":
      return new HttpError(404, "Użytkownik nie istnieje", "USER_NOT_FOUND");
    case "ALREADY_EMPLOYEE":
      return new HttpError(
        409,
        "Ten użytkownik jest już pracownikiem",
        "ALREADY_EMPLOYEE"
      );
    case "EMPLOYEE_NOT_FOUND":
      return new HttpError(404, "Pracownik nie istnieje", "EMPLOYEE_NOT_FOUND");
    case "RESERVATION_NOT_FOUND":
      return new HttpError(
        404,
        "Nie znaleziono rezerwacji",
        "RESERVATION_NOT_FOUND"
      );
    case "SEAT_ALREADY_RESERVED":
      return new HttpError(409, "Miejsce już zajęte", "SEAT_ALREADY_RESERVED");
    case "MOVIE_NOT_FOUND":
      return new HttpError(404, "Nie znaleziono filmu", "MOVIE_NOT_FOUND");
    case "PAYMENT_NOT_FOUND":
      return new HttpError(
        404,
        "Nie znaleziono płatności",
        "PAYMENT_NOT_FOUND"
      );
    case "INVALID_STATUS_TRANSITION":
      return new HttpError(
        409,
        "Invalid status transition",
        "INVALID_STATUS_TRANSITION"
      );
    case "GENRE_EXISTS":
      return new HttpError(409, "Taki gatunek już istnieje", "GENRE_EXISTS");
    case "HALL_EXISTS":
      return new HttpError(
        409,
        "Sala o takiej nazwie już istnieje",
        "HALL_EXISTS"
      );
    case "HALL_NOT_FOUND":
      return new HttpError(404, "Nie znaleziono sali", "HALL_NOT_FOUND");
    case "SEAT_NOT_FOUND":
      return new HttpError(404, "Nie znaleziono miejsca", "SEAT_NOT_FOUND");
    default:
      return new HttpError(
        500,
        err instanceof Error ? err.message : String(err),
        "INTERNAL_ERROR"
      );
  }
};
