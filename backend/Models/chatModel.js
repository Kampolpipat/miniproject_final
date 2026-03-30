import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ChatModel = mongoose.model('Chat', ChatSchema);
export default ChatModel;
