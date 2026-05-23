import Expense from "../../models/expense.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  calculateEqualSplit,
  validateExactSplit,
  validateParticipants,
} from "../../utils/expense.js";

const createExpense = asyncHandler(async (req, res) => {
  const {
    tripId,
    title,
    amount,
    participants,
    splitType,
    paidBy,
    category,
    date,
  } = req.body;

  
  if (!participants || !participants.length) {
    throw new ApiError(400, "At least one participant is required");
  }

  validateParticipants(participants);

  let finalParticipants = participants;

  if (splitType === "equal") {
    finalParticipants = calculateEqualSplit(amount, participants);
  } else {
    validateExactSplit(amount, participants);
  }

  const expense = await Expense.create({
    tripId,
    userId: req.user._id,
    title,
    amount,
    participants: finalParticipants,
    splitType,
    paidBy,
    category,
    date,
  });

  res.status(201).json(new ApiResponse(201, expense, "Expense created successfully"));
});

export default createExpense;