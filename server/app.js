import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config();
import axios from 'axios'
const app = express();

app.set("trust proxy", 1);
app.use(cors({
    origin: [process.env.CORS_ORIGIN,"http://localhost:5173"],
     methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});
// Routes
import router from './src/routes/user.routes.js';
import destiRouter from './src/routes/destination.routes.js';
import itineraryRouter from './src/routes/itinerary.routes.js';
import expenseTrackerRouter from './src/routes/expenseTracker.routes.js';

app.use("/api/users",router);
app.use("/api/destination",destiRouter);
app.use("/api/itinerary",itineraryRouter);
app.use("/api/expenses", expenseTrackerRouter);
app.use(express.static("public"));
app.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is active",
    time: new Date()
  });
});
app.get('/api/proxy-image', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: 'URL is required' });

    const allowedDomains = ['maps.googleapis.com', 'lh3.googleusercontent.com', 'images.unsplash.com','res.cloudinary.com'];
    const isAllowed = allowedDomains.some(domain => url.includes(domain));
    if (!isAllowed) return res.status(403).json({ error: 'Domain not allowed' });

    const response = await axios.get(url, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (err) {
    console.error('Image proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

export default app;