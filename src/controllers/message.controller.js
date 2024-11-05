import Conversation from "../models/converstaion.model.js";
import Message from "../models/messages.model.js";

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

    // Find the conversation between the sender and the specified user
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // Load the actual messages instead of just their IDs

    // If no conversation is found, return an empty array
    if (!conversation) return res.status(200).json([]);

    // Return the messages in the conversation
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
