import mongoose, { Schema } from 'mongoose'

const expenseSchema = new Schema({
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
    title: {
        type: String,
        required: true
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
    amount: { type: Number, required: true, min: 0 },
    description: { type: String },
    date: { type: Date, default: Date.now, index: "true" },
    createdAt: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;