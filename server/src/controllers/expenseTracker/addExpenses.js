import { asyncHandler } from "../../utils/asyncHandler";
import Expense from "../../models/expense.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

const addExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const expense = await Expense.findById(id);
    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }
    if (expense.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to modify this expense");
    }

    const allowedFields = [
    "title",
    "amount",
    "category",
    "paymentMethod",
    "date",
    "notes"
  ];

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      expense[key] = updates[key];
    }
  });
  
  await expense.save();

  return res.status(200).json(new ApiResponse(200, expense, "Expense updated successfully"));
});

export default addExpense;