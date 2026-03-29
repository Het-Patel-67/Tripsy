import mongoose,{Schema} from "mongoose"
const itinerarySchema = new Schema({
  user: { type: ObjectId, ref: "User" },
  city: { type: ObjectId, ref: "City" },
  days: Number,
  plan: [
    {
      day: Number,
      places: [
        {
          placeId: { type: ObjectId, ref: "Place" },
          time: String
        }
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;