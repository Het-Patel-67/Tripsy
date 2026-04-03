import Expense from "../../models/expense.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse.js";
const createExpense = asyncHandler(async (req, res) => {
    const {description, amount, category, title,date} = req.body;
    if(!description || !amount || !category || !title || !date) {
        throw new ApiError(400, "All fields are required");
    }
    if(req.user) {
        const expense = new Expense({
            title,
            description,
            amount,
            category,
            date,
            userId: req.user._id
        });
        await expense.save();
        return res.status(201).json(new ApiResponse(201, expense, "Expense created successfully"));
    }
    else{
        throw new ApiError(401, "Unauthorized");
    }
});

export default createExpense;