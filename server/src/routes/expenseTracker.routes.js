import { Router } from 'express';
import createExpense from '../controllers/expenseTracker/createExpenses.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import removeExpense from '../controllers/expenseTracker/removeExpenses.js';
import getExpenses from '../controllers/expenseTracker/getExpenses.js';
import updateExpense from '../controllers/expenseTracker/updateExpenses.js';

const expenseTrackerRouter = Router();

expenseTrackerRouter.post("/", verifyJWT, createExpense);
expenseTrackerRouter.get("/", verifyJWT, getExpenses);
expenseTrackerRouter.put("/edit/:id", verifyJWT, updateExpense);
expenseTrackerRouter.delete("/delete/:id", verifyJWT, removeExpense);
expenseTrackerRouter.get("/balance", verifyJWT, getBalances);
export default expenseTrackerRouter;