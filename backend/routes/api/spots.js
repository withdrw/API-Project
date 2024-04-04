const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const bcrypt = require("bcryptjs");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { User, Spot, Review, SpotImage, Booking } = require("../../db/models");

async function newAvg(spots) {
  const newSpots = spots;
  console.log("avgSpot");
  console.log(newSpots);
  for (const avgSpot of newSpots) {
    const reviews = await Review.findAll({
      where: { spotId: avgSpot.id },
    });
    const total = reviews.reduce((sum, reviews) => sum + reviews.stars, 0);
    console.log("total value", total);
    console.log(reviews);
    avgSpot.dataValues.avgRating = total / reviews.length;
  }
}

async function newImages(spots) {
  const preImage = spots;
  for (const viewImage of preImage) {
    const images = await SpotImage.findAll({
      where: {
        id: viewImage.id,
        preview: true,
      },
    });
    if (images.length > 0 && images[0].dataValues) {
      viewImage.dataValues.previewImage = images[0].dataValues.url;
    }
  }
}

router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll();
  await newAvg(spots);
  await newImages(spots);
  res.json(spots);
});

router.get("/current", async (req, res) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
  });
  await newAvg(spots);
  console.log("total values");
  await newImages(spots);
  console.log("total values");
  res.json(spots);
});

router.get("/:spotId", async (req, res) => {
  const spotId = req.params.spotId;
  const newSpot = await Spot.findAll({
    where: {
      id: spotId,
    },
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });
  if (!newSpot) {
    res.status(404).json({ message : "Spot couldn't be found"})
   }
  res.json(newSpot);
});

router.post("/", requireAuth, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const errors = {};

  if (!address) {
    errors.address = "Street address is required";
  }

  if (!city) {
    errors.city = "City is required";
  }

  if (!state) {
    errors.state = "State is required";
  }

  if (!country) {
    errors.country = "Country is required";
  }

  if (!lat || lat < -90 || lat > 90) {
    errors.lat = "Latitude must be within -90 and 90";
  }

  if (!lng || lng < -180 || lng > 180) {
    errors.lng = "Longitude must be within -180 and 180";
  }

  if (!name || name.length > 50) {
    errors.name = "Name must be less than 50 characters";
  }

  if (!description) {
    errors.description = "Description is required";
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.price = "Price per day must be a positive number";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors,
    });
  }
  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  res.status(201).json(newSpot);
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const { user } = req;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404).json({ message: "Spot not found" });
  }
  if (spot.ownerId !== user.id) {
    return res.status(404).json({
      message: "Unauthorized. Spot does not belong to the current user",
    });
  }

  const newImage = await await SpotImage.create({ url, preview });
  res.json(newImage);
});

router.put("/:spotId", requireAuth, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const spot = Spot.findByPk(spotId);
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  if (!spot) {
    return res.status(404).json({ message: "Spot not found" });
  }

  const errors = {};

  if (!address) {
    errors.address = "Street address is required";
  }

  if (!city) {
    errors.city = "City is required";
  }

  if (!state || typeof String) {
    errors.state = "State is required";
  }

  if (!country) {
    errors.country = "Country is required";
  }

  if (!lat || lat < -90 || lat > 90) {
    errors.lat = "Latitude must be within -90 and 90";
  }

  if (!lng || lng < -180 || lng > 180) {
    errors.lng = "Longitude must be within -180 and 180";
  }

  if (!name || name.length > 50) {
    errors.name = "Name must be less than 50 characters";
  }

  if (!description) {
    errors.description = "Description is required";
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.price = "Price per day must be a positive number";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors,
    });
  }
  const newSpot = await Spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  res.status(201).json(newSpot);
});

// start by finding a spot , create a spot image , assign its spot id to its current spot
// REVIEW IMAGES HAS A LIMIT OF 10
// ROUTER POST API / SPOT /
// DELETE

router.delete("/:spotId", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findOne({
    where: { id: spotId },
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  await Spot.destroy({ where: { id: spotId } });
  res.status(200).json({ message: "Successfully deleted" });
});

router.post("/:spotId/reviews", async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  let { review, stars } = req.body;
  const rev = await Review.findOne({
    where: {
      userId: req.user.id,
      spotId: spotId,
    },
  });
  if (!spot) {
    res.status(303).json({ message: "Spot couldn't be found" });
  }

  if (rev) {
    res
      .status(500)
      .json({ message: "User already has a review for this spot" });
  }

  const createReview = await Review.create({
    userId: req.user.id,
    spotId,
    review,
    stars,
  });
  res.json(createReview);
});

// Get all Bookings for a Spot based on the Spot's id

// Create a Booking from a Spot based on the Spot's id

module.exports = router;
