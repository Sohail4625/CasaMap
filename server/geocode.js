require("dotenv").config();
var NodeGeocoder = require("node-geocoder");

var geocoder = NodeGeocoder({
  provider: "opencage",
  apiKey: process.env.OPENCAGE_API_KEY,
});

async function geocoder_func(address) {
  var ans = await geocoder.geocode(
    address
  );
  return ([ans[0].latitude,ans[0].longitude]);
}


module.exports = geocoder_func
