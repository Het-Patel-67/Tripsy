import mongoose, { Schema } from "mongoose"


const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city'
    },
    cityName: {
        type: String
    },
    stateName: {
        type: String
    },
    category: {
        type: String,
        enum: [
            "adventure",
            "nature",
            "cultural",
            "historical",
            "religious",
            "entertainment",
            "food",
            "shopping",
            "stay",
            "beach",
            "mountain",
            "tourist",
            "hotel",
            "restaurant"
        ]
    },
    types: {
        type: [String]
    },
    recommendedDuration: {
        type: Number
    },
    rating: {
        type: Number
    },
    description: {
        type: String
    },
    images: {
        type: [String]
    },
    optimizedImage: {
        type: String,
        default: null
    },

    imageUploaded: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number
    },
    amenities: {
        type: [String]
    },
    rawCategory: {
        type: String
    },
    user_review: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    fetchedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

placeSchema.index({ location: "2dsphere" });
placeSchema.index({
    city: 1
});

placeSchema.index({
    category: 1
});

placeSchema.index({
    rating: -1
});
placeSchema.index(
    { fetchedAt: 1 },
    { expireAfterSeconds: 5184000 }
);
const Place = mongoose.model('Place', placeSchema);


export default Place

