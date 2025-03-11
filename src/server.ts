import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", router());

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
