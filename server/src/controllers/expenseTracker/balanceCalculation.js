import { asyncHandler } from "../../utils/asyncHandler.js";
import { getParticipantId } from "../../utils/expense.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Expense from "../../models/expense.model.js";
 const getBalances = asyncHandler(async (req, res) => {
 
    const { tripId } = req.query;

    const expenses = await Expense.find({
      tripId,
      isDeleted: false
    });

    const balances = {};

    expenses.forEach(exp => {
      const payerId = exp.paidBy.user
        ? exp.paidBy.user.toString()
        : exp.paidBy.name;

      // Add full amount to payer
      balances[payerId] = (balances[payerId] || 0) + exp.amount;

      // Subtract shares
      exp.participants.forEach(p => {
        const id = getParticipantId(p);
        balances[id] = (balances[id] || 0) - p.share;
      });
    });

    res.json(new ApiResponse(200, { balances }, "Balances calculated successfully"));

  
});
export default getBalances;