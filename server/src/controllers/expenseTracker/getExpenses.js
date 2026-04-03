import { asyncHandler } from "../../utils/asyncHandler.js";
import Expense from "../../models/expense.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getExpenses = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId, isDeleted: false });
    if (!expenses) {
        throw new ApiError(404, "No expenses found");
    }

    return res.status(200).json(new ApiResponse(200, expenses, "Expenses fetched successfully"));
});

export default getExpenses;