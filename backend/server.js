import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import http from 'http';
import setupSocket from './socket.js';

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Create an HTTP server using Express app
const server = http.createServer(app);

// Set up the socket server
setupSocket(server);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
