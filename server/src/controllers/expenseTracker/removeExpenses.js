import { asyncHandler } from "../../utils/asyncHandler.js";
import Expense from "../../models/expense.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const removeExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const expense = await Expense.findById(id);
    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }
    if (expense.userId.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to delete this expense");
    }

    expense.isDeleted = true;
    await expense.save();

    return res.status(200).json(new ApiResponse(200, null, "Expense deleted successfully"));
});

export default removeExpense;