import mongoose from 'mongoose'

const chatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: [true, 'Session is required'],
      index: true,
    },
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: [true, 'Sender is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [4000, 'Content cannot exceed 4000 characters'],
    },
  },
  {
    timestamps: true,
  }
)

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema)

export default ChatMessage
