import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    share: {
        type: Number,
        required: true,
        min: 0
    }
});

const expenseSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
        required: true,
        index: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paidBy: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },

    participants: [participantSchema],

    splitType: {
        type: String,
        enum: ["equal", "exact"],
        default: "equal"
    },

    title: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    category: {
        type: String,
        enum: ["food", "transport", "hotel", "activity", "shopping", "other"],
        default: "other",
        index: true
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "online"],
        default: "cash"
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now, index: "true" },
    createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);