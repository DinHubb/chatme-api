import { Server } from "socket.io";
import { ChatService } from "../services/chat.service";

export function initChatSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("🔌 Пользователь подключён:", socket.id);

    socket.on("joinRoom", ({ chat_id }) => {
      socket.join(`chat_${chat_id}`);
      console.log(`➡️ Socket ${socket.id} joined chat_${chat_id}`);
    });

    socket.on("message", async ({ chat_id, sender_id, content }) => {
      await ChatService.sendMessage(chat_id, sender_id, co ntent);

      io.to(`chat_${chat_id}`).emit("message", {
        chat_id,
        sender_id,
        content,
        sent_at: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Пользователь отключён:", socket.id);
    });
  });
}
