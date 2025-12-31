import express from "express";
import path from "path";
import session from "express-session";
import router from "@routes/index";
import errorHandler from "@middlewares/error.middleware";

const app = express();

/* ================= VIEW ENGINE ================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "sid", // 👈 WAŻNE – ta sama nazwa wszędzie
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // 👈 KLUCZOWE dla fetch + redirect
      maxAge: 1000 * 60 * 60, // 1 godzina
    },
  })
);

/* ================= ROUTES ================= */
app.use(router);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

export default app;
