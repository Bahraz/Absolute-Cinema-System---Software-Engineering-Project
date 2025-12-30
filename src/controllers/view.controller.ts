import type { Request, Response } from "express";

export class ViewController {
  home(req: Request, res: Response) {
    if (!req.user) {
      return res.redirect("/login");
    }

    if (req.user.employeeRole) {
      return res.redirect("/admin/dashboard");
    }

    return res.redirect("/user/dashboard");
  }

  login(req: Request, res: Response) {
    res.render("auth/login");
  }

  register(req: Request, res: Response) {
    res.render("auth/register");
  }
  logout(req: Request, res: Response){
    res.render("auth/logout");
  }
}

export const viewController = new ViewController();
