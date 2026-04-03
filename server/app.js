import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
// Routes
import router from './src/routes/user.routes.js';
import destiRouter from './src/routes/destination.routes.js';
import itineraryRouter from './src/routes/itinerary.routes.js';
import expenseTrackerRouter from './src/routes/expenseTracker.routes.js'

app.use("/api/users",router);
app.use("/api/destination",destiRouter);
app.use("/api/itinerary",itineraryRouter);
app.use("/api/expenseTracker", expenseTrackerRouter);

app.use(express.static("public"));


export default app;