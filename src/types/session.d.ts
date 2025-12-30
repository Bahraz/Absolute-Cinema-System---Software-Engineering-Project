import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      role: "ADMIN" | "USER";
      email: string;
      name: string;
    };
  }
}
