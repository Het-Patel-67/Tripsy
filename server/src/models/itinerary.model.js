import mongoose,{Schema} from "mongoose"
const itinerarySchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
  days: Number,
  startDate: Date,
  budget: {
    type: String,
    enum: ["High", "medium", "low"]
  },
  cityName: String,  
  stateName: String, 
  plan: [
    {
      day: Number,
      date: String,
      places: [
        {
          placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
          name: String,
          category: String,
          image: String,
          images: [String],
          description: String,
          types: [String],
          user_review: String,
          rating: Number,
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