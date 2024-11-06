import Conversation from "../models/converstaion.model.js";
import Message from "../models/messages.model.js";
import { getReceiverSocketId, io } from "../Socket/socket.js";
// Controller for sending a message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check if a conversation exists between the sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // Add the message ID to the conversation's messages array
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // Save both the conversation and the new message in parallel
    await Promise.all([conversation.save(), newMessage.save()]);
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("reciver socket id",receiverSocketId)
		if (receiverSocketId) {
      console.log(receiverSocketId)
			// io.to(<socket_id>).emit(x) used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}
    // Return the saved message as the response
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for getting messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    
    // Set default values for pagination
    const page = parseInt(req.query.page) || 1; // Page number
    const limit = 20; // Fixed limit of 20 messages per request

    // Find the conversation between the sender and the specified user
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate({
      path: "messages",
      options: {
        sort: { createdAt: -1 }, // Sort by createdAt in descending order to get the latest messages
        skip: (page - 1) * limit, // Skip messages based on the page number
        limit: limit, // Limit to 20 messages
      },
      populate: [
        {
          path: "senderId", // Populate the sender user info
          select: "name phoneNumber", // Select the fields you need from the User model
        },
        {
          path: "receiverId", // Populate the receiver user info
          select: "name phoneNumber", // Select the fields you need from the User model
        },
      ],
    });

    // If no conversation is found, return an empty array
    if (!conversation) return res.status(200).json([]);

<<<<<<< HEAD
    // Return the messages in the conversation
    const messages = conversation.messages.reverse();
=======
    // Return the paginated messages in the conversation
    const messages = conversation.messages;
>>>>>>> d279ae829d56bc549c1102281ac97b9ed3f1aca4
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
