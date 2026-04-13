import { asyncHandler } from "../../utils/asyncHandler.js";
import Expense from "../../models/expense.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getExpenses = asyncHandler(async (req, res) => {
    const {
      tripId,
      category,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {
      userId: req.user._id,
      isDeleted: false
    };

    if (tripId) filter.tripId = tripId;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const expenses = await Expense.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ date: -1 });

    const total = await Expense.countDocuments(filter);

   res.json(new ApiResponse(200, { expenses, pagination: { total, page: Number(page), totalPages: Math.ceil(total / limit) } }, "Expenses fetched successfully"));


});

export default getExpenses;