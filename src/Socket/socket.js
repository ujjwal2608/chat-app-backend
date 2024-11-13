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

	socket.on("call", (data) => {
		let calleeId = data.calleeId;
		let rtcMessage = data.rtcMessage;
		socket.to(calleeId).emit("incomming_call", {
			callerId: userPhone,
			rtcMessage: rtcMessage,
		});
	});

	socket.on("answerCall", (data) => {
		let callerId = data.callerId;
		let rtcMessage = data.rtcMessage;
		socket.to(callerId).emit("call_accepted", {
			callee: userPhone,
			rtcMessage: rtcMessage,
		});
	});

	socket.on("ICEcandidate", (data) => {
		console.log("ICEcandidate data.calleeId", data.calleeId);
		let calleeId = data.calleeId;
		let rtcMessage = data.rtcMessage;
		socket.to(calleeId).emit("ICEcandidate", {
			sender: userPhone,
			rtcMessage: rtcMessage,
		});
	});
});

export { app, io, server };