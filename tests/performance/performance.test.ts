import request from "supertest";
import app from "../../src/app"; 
import { performance } from "perf_hooks";
import { seatRepository } from "@repositories/seat.repository";
import { reservationRepository } from "@repositories/reservation.repository";
import { screeningRepository } from "@repositories/screening.repository";

// 1. AUTH MOCKING
jest.mock("@middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: "test-user-id" }; 
    next();
  }
}));

jest.mock("@middlewares/user.middleware", () => ({
  userOnly: (req: any, res: any, next: any) => next()
}));

// 2. REPOSITORIES MOCKING
jest.mock("@repositories/seat.repository");
jest.mock("@repositories/reservation.repository");
jest.mock("@repositories/screening.repository");

describe("Hall Layout Response Time - SRT-003", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();

    // Generujemy dokładnie 100 testowych miejsc
    const mockSeats = Array.from({ length: 100 }, (_, i) => ({
      _id: `seat-${i}`,
      row: Math.floor(i / 10),
      seat_number: i % 10,
      hall_id: "hall-1"
    }));

    (screeningRepository.findById as jest.Mock).mockResolvedValue({
      _id: "test-screening",
      hall_id: "hall-1"
    });

    (seatRepository.findByHall as jest.Mock).mockResolvedValue(mockSeats);

    // ZMIANA: Zwracamy pustą tablicę rezerwacji, aby serwis zwrócił wszystkie 100 miejsc
    // Dzięki temu test wydajnościowy sprawdza pełne obciążenie sali.
    (reservationRepository.findByScreening as jest.Mock).mockResolvedValue([]);
  });

  it("should load hall layout in less than 2 seconds and return complete mapping", async () => {
    const start = performance.now();
    
    const response = await request(app)
      .get(`/api/user/reservations/screenings/test-screening/seats`);
    
    const end = performance.now();
    const duration = end - start;

    console.log(`Response time (Database): ${duration.toFixed(2)}ms`);

    // --- ASERCJE LOGICZNE ---
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    
    // Teraz oczekujemy dokładnie 100, bo rezerwacje w mocku są puste
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(100); 

    expect(response.body[0]).toHaveProperty('_id', 'seat-0');

    // --- ASERCJA WYDAJNOŚCIOWA ---
    expect(duration).toBeLessThan(2000);
  });
});