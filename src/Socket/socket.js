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
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	const userPhone = socket.handshake.query.userPhone;
	userSocketMap[userId] = socket.id;
	console.log(`User ${userId} connected with socket ID ${socket.id}`);
	io.emit("user_joined", { userId, userPhone });
	io.emit("getOnlineUsers", Object.keys(userSocketMap));
	console.log("online users: ", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		delete userSocketMap[userId];
		console.log(`User ${userId} disconnected`);
	});

	console.log(userPhone, "Connected");
	socket.join(userPhone);

	socket.on("call_user", (data) => {
		const { targetUserId, rtcMessage } = data;
		const targetSocketId = userSocketMap[targetUserId];
		if (targetSocketId) {
		  io.to(targetSocketId).emit("incoming_call", {
			callerId: userId,
			rtcMessage,
		  });
		}
	  });
	
	  socket.on("accept_call", (data) => {
		const { callerId, rtcMessage } = data;
		const callerSocketId = userSocketMap[callerId];
		if (callerSocketId) {
		  io.to(callerSocketId).emit("call_accepted", {
			calleeId: userId,
			rtcMessage,
		  });
		}
	  });
	
	  socket.on("decline_call", (data) => {
		const { callerId } = data;
		const callerSocketId = userSocketMap[callerId];
		if (callerSocketId) {
		  io.to(callerSocketId).emit("call_declined", { calleeId: userId });
		}
	  });
	
	  socket.on("ice_candidate", (data) => {
		const { targetUserId, rtcMessage } = data;
		const targetSocketId = userSocketMap[targetUserId];
		if (targetSocketId) {
		  io.to(targetSocketId).emit("ice_candidate", {
			senderId: userId,
			rtcMessage,
		  });
		}
	  });
});

export { app, io, server };