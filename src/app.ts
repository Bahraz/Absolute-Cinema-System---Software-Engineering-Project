import express from "express";
import path from "path";
import session from "express-session";
import router from "@routes/index";
import errorHandler from "@middlewares/error.middleware";

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(router);

app.use(errorHandler);

export default app;
