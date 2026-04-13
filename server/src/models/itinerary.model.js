import mongoose,{Schema} from "mongoose"
const itinerarySchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
  days: Number,
  startDate: Date,
  plan: [
    {
      day: Number,
      date: String,
      places: [
        {
          placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
          name: String,
          category: String,
          location: {
            type: {
              type: String,
              enum: ["Point"]
            },
            coordinates: [Number]
          },
          time: String
        }
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;