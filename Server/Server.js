import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./Lib/db.js";
import userRouter from "./Routes/UserRoutes.js";
import { initSocket } from "./Lib/socket.js";

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is live 🚀"));
app.use("/api/auth", userRouter);

const startServer = async () => {
  try {
    await connectDB();

    const { default: MessageRouter } = await import("./Routes/MessageRouter.js");
    app.use("/api/messages", MessageRouter);

    initSocket(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on PORT: ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
