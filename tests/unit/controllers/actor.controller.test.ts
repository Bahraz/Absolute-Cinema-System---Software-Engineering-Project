import { actorsController } from "@controllers/actor.controller";
import { actorService } from "@services/actor.service";
import { HttpError } from "@utils/httpError";

jest.mock("@services/actor.service", () => ({
  actorService: {
    create: jest.fn(),
    update: jest.fn(),
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

describe("ActorsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("powinien zawołać next(HttpError) gdy brakuje name lub surname", async () => {
      const req: any = { body: { name: "Jan" } };
      const res = makeRes();
      const next = jest.fn();

      await actorsController.create(req, res as any, next);

      expect(actorService.create).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalledTimes(1);

      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).status).toBe(400);
      expect((err as HttpError).message).toBe("Brak danych");
      expect((err as HttpError).code).toBe("MISSING_FIELDS");
    });
  });

  describe("update", () => {
    it("powinien zaktualizować aktora i zwrócić json(actor)", async () => {
      (actorService.update as jest.Mock).mockResolvedValue({
        _id: "1",
        name: "Nowe",
        surname: "Dane",
      });

      const req: any = {
        params: { id: "1" },
        body: { name: "Nowe", surname: "Dane" },
      };
      const res = makeRes();
      const next = jest.fn();

      await actorsController.update(req, res as any, next);

      expect(res.json).toHaveBeenCalledWith({
        _id: "1",
        name: "Nowe",
        surname: "Dane",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
