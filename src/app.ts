import express from "express";
import path from "path";
import { router } from "@routes/routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

export default app;
