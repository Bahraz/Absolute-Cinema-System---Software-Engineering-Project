import { movieController } from "@controllers/movie.controller";
import { movieService } from "@services/movie.service";

jest.mock("@services/movie.service", () => ({
    movieService: {
        deleteMovie: jest.fn(),
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

describe("MovieController.delete", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("powinien usunąć film i zwrócić 204", async () => {
        (movieService.deleteMovie as jest.Mock).mockResolvedValue(true);

        const req: any = {
            params: { id: "123" },
        };
        const res = makeRes();
        const next = jest.fn();

        await movieController.delete(req, res as any, next);

        expect(movieService.deleteMovie).toHaveBeenCalledWith("123");
        expect(res.sendStatus).toHaveBeenCalledWith(204);
        expect(next).not.toHaveBeenCalled();
    });
});
