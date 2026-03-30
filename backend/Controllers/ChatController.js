import ChatModel from "../Models/chatModel.js";

export const sendMessage = async (req, res) => {
  const { conversationId, senderId, receiverId, text } = req.body;

  if (!conversationId || !senderId || !receiverId || !text) {
    return res.status(400).json({ message: "Missing chat data" });
  }

  try {
    const newMessage = new ChatModel({ conversationId, senderId, receiverId, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const messages = await ChatModel.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
