import { AuthController } from "@controllers/auth.controller";
import { authService } from "@services/auth.service";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "@utils/httpError";

// 1. Mockujemy authService, aby odizolować logikę kontrolera od bazy danych
jest.mock("@services/auth.service");

describe("User Registration - SRT-001", () => {
  let controller: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    controller = new AuthController();
    nextFunction = jest.fn();

    // Mockujemy response z obsługą "chainingu" (res.status().json())
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = { body: {} };
    jest.clearAllMocks();
  });

  it("Return 201 and user data when registration is successful", async () => {
    // Arrange: Wszystkie wymagane pola są obecne
    const userData = {
      name: "Jan",
      surname: "Kowalski",
      email: "jan@test.com",
      password: "password123",
    };
    mockRequest.body = userData;

    const mockCreatedUser = { _id: "mock-id", email: userData.email };
    (authService.register as jest.Mock).mockResolvedValue(mockCreatedUser);

    // Act
    await controller.register(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    // Assert
    expect(authService.register).toHaveBeenCalledWith(userData);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Rejestracja zakończona sukcesem.",
      id: "mock-id",
      email: userData.email,
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("Throw HttpError 400 if name is missing", async () => {
    // Arrange: Celowo usuwamy pole 'name', aby wywołać błąd walidacji
    mockRequest.body = {
      surname: "Kowalski",
      email: "jan@test.com",
      password: "password123",
    };

    // Act
    await controller.register(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    // Assert
    expect(nextFunction).toHaveBeenCalled();
    const error = (nextFunction as jest.Mock).mock.calls[0][0];

    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(400);
    
    // Sprawdzamy kod błędu (obsługuje errorCode lub code w zależności od Twojej klasy)
    const actualErrorCode = error.errorCode || error.code;
    expect(actualErrorCode).toBe("MISSING_FIELDS");
  });

  it("Forwards errors to the next() function in case of authService failure (e.g., email already in use)", async () => {
    // Arrange
    mockRequest.body = {
      name: "Jan",
      surname: "K",
      email: "j@t.com",
      password: "pass",
    };
    const serviceError = new Error("Email already exists");
    (authService.register as jest.Mock).mockRejectedValue(serviceError);

    // Act
    await controller.register(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    // Assert
    expect(nextFunction).toHaveBeenCalledWith(serviceError);
  });
});