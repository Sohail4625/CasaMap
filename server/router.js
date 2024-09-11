const express = require("express");
const passport = require("passport");
require("./passport");
const { User, savedHouses, House } = require("./database");
const { generateToken, verifyToken } = require("./jwtUtils");
var database = require("./database");
var geocoder_func = require("./geocode");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
function isPasswordValid(password) {
  const minLength = 8;
  const hasNumber = /[0-9]/;
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;
  const isLongEnough = password.length > minLength;

  return isLongEnough && hasNumber.test(password) && hasSymbol.test(password);
}

// Google Authentication Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    console.log("Entered");
  }
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`/?token=${token}`);
  }
);

router.post("/api/login", async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.username }],
  });
  if (!user) {
    return res.status(200).json({ message: "User not found" });
  } else {
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(200).json({ message: "Password incorrect" });
      }
    }
  }
  const token = generateToken(user);
  res.status(200).json({ message: token });
});

router.post("/api/register", async (req, res) => {
  console.log(req.body);
  const response = await User.find({
    username: req.body.username,
  });
  let message = "";
  if (response.length > 0) {
    message = "username not available";
  } else if (!isPasswordValid(req.body.password)) {
    message =
      "Password should be minimum 8 characters length with atleast one digit and one symbol";
  } else {
    const hashedpass = await bcrypt.hash(req.body.password, 10);
    const newUser = await User({
      name: req.body.name,
      username: req.body.username,
      password: hashedpass,
      email: req.body.email,
    });
    const resp = await newUser.save();
    if (resp) {
      message = "New Account Created";
    }
  }
  res.status(200).json({ message: message });
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(403);
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

router.get("/api/profile", authenticateJWT, async (req, res) => {
  const resp = await User.findById(req.user.id);
  const saved = await savedHouses.find({
    user: resp.username,
  });
  console.log(saved);
  const listed = await House.find({
    owner_id: resp.username,
  });
  const listedFilter = listed.map((item) => {
    return {
      house_id: item._id,
      houseName: item.houseName,
    };
  });
  const savedFilter = saved.map((item) => {
    return {
      house_id: item.house_id,
      houseName: item.houseName,
    };
  });
  res.status(200).json({
    message: {
      username: resp.username,
      name: resp.name,
      email: resp.email,
      saved: savedFilter,
      listed: listedFilter,
    },
  });
});

router.post("/api/profile", authenticateJWT, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  );
  res.status(200).json({ message: "Success" });
});

router.get("/api/userHouses/:id", async (req, res) => {
  const houses = await House.find({
    owner_id: req.params.id,
  });
  console.log(houses);
  res.status(200).json({ message: houses });
});
router.get("/api/house/:id", async (req, res) => {
  const house = await House.findById(req.params.id);
  res.status(200).json({ message: house });
});

router.get("/api/get_houses", async (req, res) => {
  const houses = await House.find().sort({ DatePosted: -1 });
  res.status(200).json({ message: houses });
});

router.post("/api/get_houses", async (req, res) => {
  const response = await House.find({
    zipcode: req.body.zipcode,
    bedrooms: req.body.bedrooms,
    property_type: req.body.propertyType,
    price: { $gte: req.body.priceRangefrom, $lte: req.body.priceRangeto },
  });
  console.log(response);
  res.status(200).json({ message: response });
});

router.post("/api/addProperty", authenticateJWT, upload.array('images'), async (req, res) => {
  try {
    const addressString = `${req.body.address}, ${req.body.city}, ${req.body.state} ${req.body.zipcode}`;
    const images = req.files.map(file => ({
      data: file.buffer.toString('base64'),
      contentType: file.mimetype 
    }));
    console.log(images.length)
    console.log(req.files.length);
    const [latitude, longitude] = await geocoder_func(addressString);
    const user = await User.findById(req.user.id);
    const newHouse = new House({
      houseName: req.body.houseName,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      price: req.body.price,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      property_type: req.body.property_type,
      square_footage: req.body.square_footage,
      latitude: latitude,
      longitude: longitude,
      owner: user.name,
      owner_id: user.username,
      Ph_no: req.body.ph_no,
      images: images
    });
    const result = await newHouse.save();
  } catch (err) {
    return res.status(403).json({ message: "Error occured !" });
  }
  res.status(200).json({ message: "Received" });
});

router.delete("/api/unsave/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await savedHouses.deleteOne({
      house_id: id
    });
    console.log(response)
    if (!response) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

router.delete("/api/housedel/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const response = await House.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

router.post("/api/save", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const saved = await savedHouses.find({
      user: user.username,
      house_id: req.body.house_id,
      houseName: req.body.houseName,
    });
    console.log(saved);
    if (saved.length==0) {
      const newsave = new savedHouses({
        user: user.username,
        house_id: req.body.house_id,
        houseName: req.body.houseName,
      });
      newsave.save();
      console.log(newsave);
      return res.json({ message: "Saved the House" });
    }
    else {
      return res.json({message: "Already Saved"});
    }
  } catch {
    return res.status(403).json({message: "Error"});
  }
});


module.exports = router;
