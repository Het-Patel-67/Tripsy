import Place from "../models/place.model.js";
import City from "../models/city.model.js";

export const generateItinerary = async (req, res) => {
    const { city, category, location } = req.body;

    const cityDoc = await City.findOne({ name: city });

    if (!cityDoc) {
        return res.status(404).json({ message: "City not found" });
    }

    const places = await Place.aggregate([
        {
            $match: {
                city: cityDoc._id,
                category: { $in: [category] }
            }
        },
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [
                        location.lng,
                        location.lat
                    ]
                },
                distanceField: "distance",
                spherical: true
            }
        },
        {
            $sort: {
                distance: 1,
                rating: -1
            }
        },
        {
            $limit: 20
        }
    ]);

    res.json(places);
};