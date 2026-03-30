import { Router } from 'express';
import {addPlaceToItinerary} from '../controllers/addPlace.controller.js';
import { removePlaceFromItinerary } from '../controllers/removePlace.controller.js';
import { replacePlaceInItinerary } from '../controllers/replacePlace.controller.js';
import { getNearbyPlaces } from '../controllers/nearbyPlaces.controller.js';
import { generateItinerary } from '../controllers/itineraryController.js';
const itineraryRouter = Router();

itineraryRouter.post("/",generateItinerary)
itineraryRouter.post("/add-place", addPlaceToItinerary);
itineraryRouter.delete("/remove-place", removePlaceFromItinerary);
itineraryRouter.put("/replace-place", replacePlaceInItinerary);
itineraryRouter.get("/nearby-suggestions", getNearbyPlaces)
export default itineraryRouter