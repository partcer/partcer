import { model, Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Ensure unique conversation between two users

// Pre-save middleware to ensure participants are sorted
conversationSchema.pre("save", function (next) {
  this.participants.sort();
  next();
});

// Static method to get or create conversation
conversationSchema.statics.getOrCreate = async function (userId1, userId2) {
  if (!userId1 || !userId2) {
    throw new Error("Both user IDs are required");
  }

  // IMPORTANT: Prevent creating conversation with self
  if (userId1.toString() === userId2.toString()) {
    throw new Error("Cannot create conversation with yourself");
  }

  const participant1 = userId1.toString();
  const participant2 = userId2.toString();

  // Sort to ensure consistent order
  const participants = [participant1, participant2].sort();

  // Find existing conversation with BOTH participants (not just one)
  let conversation = await this.findOne({
    participants: { $all: participants, $size: 2 },
  });

  if (!conversation) {
    conversation = await this.create({
      participants: participants,
      unreadCount: new Map([
        [participant1, 0],
        [participant2, 0],
      ]),
    });
  }

  return conversation;
};

const Conversation = model("Conversation", conversationSchema);
export default Conversation;
