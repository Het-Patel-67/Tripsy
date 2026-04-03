import { Router } from 'express';
import {addPlaceToItinerary} from '../controllers/itineraryController/addPlace.controller.js';
import { removePlaceFromItinerary } from '../controllers/itineraryController/removePlace.controller.js';
import { replacePlaceInItinerary } from '../controllers/itineraryController/replacePlace.controller.js';
import { getNearbyPlaces } from '../controllers/nearbyPlaces.controller.js';
import { generateItinerary } from '../controllers/itineraryController/itineraryController.js';
import { getItineraryById } from '../controllers/itineraryController/getItinerary.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const itineraryRouter = Router();

itineraryRouter.post("/", verifyJWT ,generateItinerary)
itineraryRouter.post("/add-place",  verifyJWT ,addPlaceToItinerary);
itineraryRouter.get("/:id",  verifyJWT ,getItineraryById);
itineraryRouter.delete("/remove-place",  verifyJWT ,removePlaceFromItinerary);
itineraryRouter.put("/replace-place",  verifyJWT ,replacePlaceInItinerary);
itineraryRouter.get("/nearby-suggestions", getNearbyPlaces)
export default itineraryRouter