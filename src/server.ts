import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import http, { createServer } from "http";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.routes";
import path from "path";
import fs from "fs";
import { Server } from "socket.io";
import { initChatSocket } from "./sockets/chat.socket";

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
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "../uploads/avatars"))
);

// Ensure upload dir exists
const uploadDir = path.join(__dirname, "../uploads/avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: { origin: "*" },
});

initChatSocket(io);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
