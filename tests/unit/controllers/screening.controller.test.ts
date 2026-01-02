import { screeningController } from "@controllers/screening.controller";
import { screeningService } from "@services/screening.service";
import { HttpError } from "@utils/httpError";

jest.mock("@services/screening.service", () => ({
  screeningService: {
    createScreening: jest.fn(),
  },
}));

const makeRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe("ScreeningController.create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("powinien zawołać next(HttpError) gdy brakuje movie_id, hall_id lub start_at", async () => {
    const req: any = {
      body: { movie_id: "1", hall_id: "1" },
    };
    const res = makeRes();
    const next = jest.fn();

    await screeningController.create(req, res as any, next);

    expect(screeningService.createScreening).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];

    expect(err).toBeInstanceOf(HttpError);
    expect((err as HttpError).status).toBe(400);
    expect((err as HttpError).message).toBe("Brak danych");
    expect((err as HttpError).code).toBe("MISSING_FIELDS");
  });

  it("powinien wywołać screeningService.createScreening z danymi i zwrócić 201", async () => {
    (screeningService.createScreening as jest.Mock).mockResolvedValue({
      _id: "1",
      movie_id: "1",
      hall_id: "1",
      start_at: "2026-01-02T19:00:00.000Z",
    });

    const req: any = {
      body: {
        movie_id: "1",
        hall_id: "1",
        start_at: "2026-01-02T19:00:00.000Z",
      },
    };

    const res = makeRes();
    const next = jest.fn();

    await screeningController.create(req, res as any, next);

    expect(screeningService.createScreening).toHaveBeenCalledWith({
      movie_id: "1",
      hall_id: "1",
      start_at: "2026-01-02T19:00:00.000Z",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: "1",
      movie_id: "1",
      hall_id: "1",
      start_at: "2026-01-02T19:00:00.000Z",
    });

    expect(next).not.toHaveBeenCalled();
  });
});
