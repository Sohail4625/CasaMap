const mongoose = require("./dbconnect")
const currentDate = new Date();
const Schema = mongoose.Schema;
const Decimal128 = mongoose.Decimal128
const userSchema = new Schema({
    googleId: String,
    username: {
        type: String,
        unique: true,
    },
    name: String,
    email: {
        type:String,
    },
    password: {
        type: String,
        required: false,
    },
});

const houseSchema = new Schema({
    houseName: String,
    price: Number,
    address: String,
    city: String,
    state: String,
    zipcode: String,
    property_type: String,
    bedrooms: Number,
    bathrooms: Number,
    square_footage: Number,
    latitude: Decimal128,
    longitude: Decimal128,
    owner: String,
    owner_id: String,
    Ph_no: String,
    images: [{
        data: String,
        contentType: String
    }],
    DatePosted: {
        type: Date,
        default: currentDate
    }
})

const savedSchema = new Schema({
    user: String,
    house_id: String,
    houseName: String
})


const User = mongoose.model("User", userSchema);
const House = mongoose.model("Houses",houseSchema);
const savedHouses = mongoose.model("SavedHouses", savedSchema);

module.exports = {
    User, House, savedHouses
}




