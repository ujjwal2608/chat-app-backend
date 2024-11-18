import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["https://chat-app-backend-tl4j.onrender.com"],
		methods: ["GET", "POST"],
	},
	transports: ['websocket'],
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	userSocketMap[userId] = socket.id;
	console.log(`User ${userId} connected with socket ID ${socket.id}`);
	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));
	console.log("online users: ",Object.keys(userSocketMap));
	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		delete userSocketMap[userId];
		console.log(`User ${userId} disconnected`);
	  });
});

export { app, io, server };