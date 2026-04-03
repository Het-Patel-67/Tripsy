import { Router } from 'express';
import createExpense from '../controllers/expenseTracker/createExpenses.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import addExpense from '../controllers/expenseTracker/addExpenses.js';
import removeExpense from '../controllers/expenseTracker/removeExpenses.js';

const expenseTrackerRouter = Router();

expenseTrackerRouter.post('/create', verifyJWT,createExpense);
expenseTrackerRouter.put('/edit/:id', verifyJWT, addExpense);
expenseTrackerRouter.delete('/delete/:id', verifyJWT, removeExpense);
export default expenseTrackerRouter;