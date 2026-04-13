import Expense from "../../models/expense.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const updateExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.isDeleted) {
     throw new ApiError(404, "Expense not found");
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    const updates = req.body;

    if (updates.participants) {
      validateParticipants(updates.participants);

      if (updates.splitType === "equal") {
        updates.participants = calculateEqualSplit(
          updates.amount || expense.amount,
          updates.participants
        );
      } else {
        validateExactSplit(
          updates.amount || expense.amount,
          updates.participants
        );
      }
    }

    Object.assign(expense, updates);

    await expense.save();

    res.json(new ApiResponse(200, expense, "Expense updated successfully"));

});
export default updateExpense;