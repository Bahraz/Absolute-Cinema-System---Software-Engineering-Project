import type { Request, Response, NextFunction } from "express";
import { paymentService } from "@services/payment.service";
import { HttpError } from "@utils/httpError";

export class PaymentController {
  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await paymentService.getAll();
      res.json(payments);
    } catch (err) {
      next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getById(req.params.id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = req.body;

      if (!provider) {
        throw new HttpError(
          400,
          "Provider jest wymagany",
          "MISSING_PROVIDER"
        );
      }

      const payment = await paymentService.createPayment(provider);
      res.status(201).json(payment);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;

      if (!status) {
        throw new HttpError(
          400,
          "Status jest wymagany",
          "MISSING_STATUS"
        );
      }

      const payment = await paymentService.changeStatus(
        req.params.id,
        status
      );

      res.json(payment);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await paymentService.delete(req.params.id);

      if (!deleted) {
        throw new HttpError(
          404,
          "Nie znaleziono płatności",
          "PAYMENT_NOT_FOUND"
        );
      }

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

export const paymentController = new PaymentController();