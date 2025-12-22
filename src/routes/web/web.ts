import express from "express";
import { viewController } from "@controllers/view";

const router = express.Router();

router.get("/", (req, res) => viewController.home(req, res));

// User View
router.get("/user", (req, res) => viewController.user(req, res));

// Admin View
router.get("/admin", (req, res) => viewController.adminPanel(req, res));

router.get("/actor", (req, res) => viewController.actorsPanelView(req, res));
router.get("/actor/list", (req, res) => viewController.actorsList(req, res));
router.get("/movie", (req, res) => viewController.moviesPanelView(req, res));
router.get("/movie/list", (req, res) => viewController.moviesList(req, res));
router.get("/movie/list/:id", (req, res) =>
  viewController.moviesDetails(req, res)
);
router.get("/genre", (req, res) => viewController.genresPanelView(req, res));
router.get("/genre/list", (req, res) => viewController.genresList(req, res));
router.get("/hall", (req, res) => viewController.hallsPanelView(req, res));
router.get("/hall/list", (req, res) => viewController.hallsList(req, res));
router.get("/employees", (req, res) =>
  viewController.employeesPanelView(req, res)
);
router.get("/employees/list", (req, res) =>
  viewController.employeesList(req, res)
);
router.get("/users", (req, res) => viewController.usersPanelView(req, res));
router.get("/users/list", (req, res) => viewController.usersList(req, res));
router.get("/screening", (req, res) =>
  viewController.screeningsPanelView(req, res)
);
router.get("/screening/list", (req, res) =>
  viewController.screeningsList(req, res)
);
router.get("/seat", (req, res) => viewController.seatsPanelView(req, res));
router.get("/seat/list", (req, res) => viewController.seatsList(req, res));
router.get("/ticket", (req, res) => viewController.ticketsPanelView(req, res));
router.get("/ticket/list", (req, res) => viewController.ticketsList(req, res));

router.get("/payment", (req, res) =>
  viewController.paymentsPanelView(req, res)
);
router.get("/payment/list", (req, res) =>
  viewController.paymentsList(req, res)
);

router.get("/reservation", (req,res) => viewController.reservationsPanelView(req,res));
router.get('/reservation/list', (req, res) => viewController.reservationsList(req,res));

export { router };
