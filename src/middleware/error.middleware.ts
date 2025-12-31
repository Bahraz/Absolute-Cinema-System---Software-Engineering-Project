import type { Request, Response, NextFunction } from "express";
import { HttpError, wrapServiceError } from "@utils/httpError";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const e = err instanceof HttpError ? err : wrapServiceError(err);
  res.status(e.status).json({ error: e.message, code: e.code });
}

export default errorHandler;
