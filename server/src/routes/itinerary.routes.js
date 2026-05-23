import { Router } from 'express';
import { generateItinerary } from '../controllers/itineraryController/itineraryController.js';
import { getItineraryById } from '../controllers/itineraryController/getItinerary.controller.js';
import { getUserItineraries } from "../controllers/itineraryController/getUserItineraries.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getHotelRecommendations } from '../controllers/itineraryController/hotelRecommendation.controller.js';
import { saveItinerary } from "../controllers/itineraryController/saveItinerary.controller.js";
import { removeItinerary } from '../controllers/itineraryController/removeItinerary.controller.js';

const itineraryRouter = Router();

itineraryRouter.post("/", verifyJWT, generateItinerary)
itineraryRouter.post("/save",verifyJWT, saveItinerary);
itineraryRouter.get("/my-itineraries",verifyJWT, getUserItineraries);

itineraryRouter.post(
    "/hotel-recommendations",
    verifyJWT,
    getHotelRecommendations
);
itineraryRouter.delete("/delete/:id", verifyJWT, removeItinerary);
export default itineraryRouter