import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import { screeningRepository } from "@repositories/screening.repository";
import { reservationRepository } from "@repositories/reservation.repository";
import { paymentRepository } from "@repositories/payment.repository";
import { ticketRepository } from "@repositories/ticket.repository";

// ==========================================
// 1. OMINIĘCIE RATE LIMITERA
// Jeśli używasz 'express-rate-limit', ten mock wyłączy go na czas testów
// ==========================================
jest.mock("express-rate-limit", () => {
  return () => (req: any, res: any, next: any) => next();
});

// 2. Auth & Global Mocks
const MOCK_USER_ID = new mongoose.Types.ObjectId().toString();
const VALID_SCREENING_ID = new mongoose.Types.ObjectId().toString();

jest.mock("@middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: MOCK_USER_ID };
    next();
  },
}));

jest.mock("@middlewares/user.middleware", () => ({
  userOnly: (req: any, res: any, next: any) => next(),
}));

jest.mock("qrcode", () => ({
  toDataURL: jest.fn().mockResolvedValue("data:image/png;base64,mock"),
}));

jest.mock("@repositories/screening.repository");
jest.mock("@repositories/reservation.repository");
jest.mock("@repositories/payment.repository");
jest.mock("@repositories/ticket.repository");

describe("High Load Simulation & Race Condition Prevention - SRT-004", () => {
  jest.setTimeout(90000);

  beforeEach(() => {
    jest.clearAllMocks();

    // Używamy dynamicznego generatora ID
    const generateMockId = () => new mongoose.Types.ObjectId().toString();

    (screeningRepository.findById as jest.Mock).mockResolvedValue({
      _id: VALID_SCREENING_ID,
      start_at: new Date(Date.now() + 86400000).toISOString(),
      hall_id: new mongoose.Types.ObjectId().toString(),
      price: 25,
    });

    // ZMIANA: mockImplementation gwarantuje, że przy KAZDYM wywołaniu .create()
    // zostanie wygenerowany nowy, unikalny ObjectID.
    (paymentRepository.create as jest.Mock).mockImplementation(async () => ({
      _id: generateMockId(),
    }));
    (ticketRepository.create as jest.Mock).mockImplementation(async () => ({
      _id: generateMockId(),
    }));
    (reservationRepository.create as jest.Mock).mockImplementation(
      async () => ({ _id: generateMockId() }),
    );

    (paymentRepository.delete as jest.Mock).mockResolvedValue(true);
    (ticketRepository.delete as jest.Mock).mockResolvedValue(true);
  });

  it("Handle 1000 simultaneous reservation requests without stability loss", async () => {
    const transactionCount = 1000;
    const batchSize = 100;
    const allResponses: any[] = [];

    (
      reservationRepository.findByScreeningAndSeat as jest.Mock
    ).mockResolvedValue(null);

    for (let i = 0; i < transactionCount / batchSize; i++) {
      const batch = Array.from({ length: batchSize }).map((_, index) => {
        // Losowe IP pomaga ominąć Rate Limitery bazujące na IP, jeśli mock na samej górze by nie zadziałał
        const randomIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

        return request(app)
          .post("/api/user/reservation")
          .set("X-Forwarded-For", randomIP) // Symulacja różnych użytkowników z sieci
          .send({
            screening_id: VALID_SCREENING_ID,
            seats_id: new mongoose.Types.ObjectId().toString(),
            payment_provider: "BLIK",
          });
      });
      const results = await Promise.all(batch);
      allResponses.push(...results);
    }

    const successful = allResponses.filter((res) => res.status === 201);

    if (successful.length !== transactionCount) {
      const errorExample = allResponses.find((r) => r.status !== 201);
      console.error(
        "DEBUG: Request Failed! Status:",
        errorExample?.status,
        "Body:",
        errorExample?.body,
      );
    }

    expect(successful.length).toBe(transactionCount);
  });

  it("Prevent double booking (Race Condition) in the service layer", async () => {
    const userCount = 10;
    const sameSeatId = new mongoose.Types.ObjectId().toString();

    let checkCount = 0;
    (
      reservationRepository.findByScreeningAndSeat as jest.Mock
    ).mockImplementation(async () => {
      if (checkCount === 0) {
        checkCount++;
        return null;
      }
      return { _id: "taken_id" };
    });

    const requests = Array.from({ length: userCount }).map(() => {
      const randomIP = `10.0.0.${Math.floor(Math.random() * 255)}`;

      return request(app)
        .post("/api/user/reservation")
        .set("X-Forwarded-For", randomIP)
        .send({
          screening_id: VALID_SCREENING_ID,
          seats_id: sameSeatId,
          payment_provider: "KARTA",
        });
    });

    const responses = await Promise.all(requests);
    const winners = responses.filter((res) => res.status === 201);

    if (winners.length !== 1) {
      console.error(
        "DEBUG: Race Condition Failed! First response status:",
        responses[0].status,
      );
      console.error("First response body:", responses[0].body);
    }

    expect(winners.length).toBe(1);

    const losers = responses.filter((res) => res.status !== 201);
    expect(losers.length).toBe(userCount - 1);
  });
});
