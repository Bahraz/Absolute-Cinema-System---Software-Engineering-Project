import { reservationController } from "@controllers/reservation.controller";
import { reservationService } from "@services/reservation.service";

jest.mock("@services/reservation.service", () => ({
    reservationService: { createReservation: jest.fn() },
}));

describe("ReservationController.create", () => {
    const makeRes = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it("powinien przekazać user_id z req.user.id i zwrócić 201", async () => {
        (reservationService.createReservation as jest.Mock).mockResolvedValue({
            _id: "1",
        });

        const req: any = {
            user: { id: "123" },
            body: {
                screening_id: "1",
                seats_id: "1",
                payment_provider: "BLIK",
            },
        };

        const res = makeRes();
        const next = jest.fn();

        await reservationController.create(req, res as any, next);

        expect(reservationService.createReservation).toHaveBeenCalledWith({
            user_id: "123",
            screening_id: "1",
            seats_id: "1",
            payment_provider: "BLIK",
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: "1" });
        expect(next).not.toHaveBeenCalled();
    });
});