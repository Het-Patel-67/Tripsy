import mongoose, {Schema} from 'mongoose'

const citySchema = new Schema({
    state: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: [Number]
    },
    isTouristCity: {
    type: Boolean,
    default: false
  }
},{timstamps: true})

const City = mongoose.model('City', citySchema);

export default City
