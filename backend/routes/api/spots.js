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

const {
  User,
  Spot,
  Review,
  SpotImage,
  Booking,
  ReviewImage,
} = require("../../db/models");

async function newAvg(spots) {
  const newSpots = spots;
  for (const avgSpot of newSpots) {
    const reviews = await Review.findAll({
      where: { spotId: avgSpot.id },
    });
    const total = reviews.reduce((sum, reviews) => sum + reviews.stars, 0);
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
  let { page = 1, size = 20 } = req.query;
  errors = {};

  page = parseInt(page);
  size = parseInt(size);

  offset = (page - 1) * size;

  if (isNaN(page) || page < 1 || page > 10) {
    errors.page = "Page must be greater than or equal to 1";
  }

  if (isNaN(size) || size < 1 || size > 20) {
    errors.size = "Size must be greater than or equal to 1";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors,
    });
  }

  // const spots = await Spot.findAll({
  //   limit: size,
  //   offset: offset,
  // });
  // await avgStars(spots);
  // await findPrevImg(spots);
  // res.json({ Spots: spots, page, size });

  const spots = await Spot.findAll({
    limit: size,
    offset: offset,
  });
  await newAvg(spots);
  await newImages(spots);
  for (const spot of spots) {
    //  console.log(spot)
    //  console.log(spot.dataValues.previewImage);
    spot.lat = parseFloat(spot.lat);
    spot.lng = parseFloat(spot.lng);
    spot.price = parseFloat(spot.price);
    if (!spot.dataValues.previewImage) {
      spot.dataValues.previewImage = "No image yet";
      spot.save();
    }
  }

  res.json({ Spots: spots, page, size });
});

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
  });
  await newAvg(spots);
  await newImages(spots);
  for (const spot of spots) {
    spot.dataValues.lat = parseFloat(spot.lat);
    spot.dataValues.lng = parseFloat(spot.lng);
    spot.dataValues.price = parseFloat(spot.price);
    if (!spot.dataValues.previewImage) {
      spot.dataValues.previewImage = "No Image Yet";
      spot.save();
    }
  }
  // const payload = spots.map(spot => {
  //  let avg = newAvg(spot)
  //   newImages(spot)
  //   console.log(spot)
  //    return {
  //     id: spot.id,
  //     ownerId: spot.ownerId,
  //     address: spot.address,
  //     city: spot.city,
  //     country: spot.country,
  //     lat: spot.lat,
  //     lng: spot.lng,
  //     name: spot.name,
  //     description: spot.description,
  //     price: spot.price,
  //     createdAt: spot.createdAt,
  //     updatedAt: spot.updatedAt,
  //     avgRating: spot.avgRating,
  //   }
  // })

  res.json({ Spots: spots });
});
//Final Deployment
router.get("/:spotId", async (req, res) => {
  const spotId = req.params.spotId;
  const newSpot = await Spot.findOne({
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
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
      },
    ],
  });
  if (!newSpot) {
    let err = new Error("Spot couldn't be found");
    err.status = 404;
    throw err;
  }
  // const review = await Review.findAll({
  //   where: {
  //     spotId: spotId,
  //   },
  // });
  newSpot.dataValues.numReviews = Review.length;

  const newObj = newSpot.toJSON();

  let sum = 0;
  for (let i = 0; i < newObj.Reviews.length; i++) {
    sum += newObj.Reviews[i].stars;
  }

  let avg = sum / newObj.Reviews.length;

  delete newObj.Reviews;

  newObj.avgStarRating = avg;

  res.json(newObj);
});

router.post("/", requireAuth, async (req, res, next) => {
  let { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  let errors = {};

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
  let newSpot = await Spot.create({
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
  lat: parseFloat(lat);
  lng: parseFloat(lng);
  price: parseFloat(price);
  res.status(201).json(newSpot);
});

router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const { user } = req;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    let err = new Error("Spot not found");
    err.status = 404;
    throw err;
  }
  if (spot.ownerId !== user.id) {
    let err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  const newImage = await SpotImage.create({ url, preview, spotId });
  // console.log(newImage)
  const payload = {
    id: newImage.id,
    url: url,
    preview: preview,
  };
  res.status(200).json(payload);
});

router.put("/:spotId", requireAuth, async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const spot = await Spot.findByPk(spotId);
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  if (!spot) {
    const err = new Error("Spot not found");
    err.status = 404;
    throw err;
  }

  if (spot.ownerId !== req.user.id) {
    let err = new Error("Unauthorized");
    err.status = 403;
    throw err;
  }

  const err = new Error("Bad Request");
  err.status = 400;
  err.errors = {};
  if (!address) {
    err.errors.address = "Street address is required";
  }

  if (!city) {
    err.errors.city = "City is required";
  }

  if (!state) {
    err.errors.state = "State is required";
  }

  if (!country) {
    err.errors.country = "Country is required";
  }

  if (!lat || lat < -90 || lat > 90) {
    err.errors.lat = "Latitude must be within -90 and 90";
  }

  if (!lng || lng < -180 || lng > 180) {
    err.errors.lng = "Longitude must be within -180 and 180";
  }

  if (!name || name.length > 50) {
    err.errors.name = "Name must be less than 50 characters";
  }

  if (!description) {
    err.errors.description = "Description is required";
  }

  if (!price || isNaN(price) || price <= 0) {
    err.errors.price = "Price per day must be a positive number";
  }

  if (Object.keys(err.errors).length) {
    return res.status(400).json({
      message: "Bad Request",
      err: err.errors,
    });
  }
  const newSpot = await spot.update({
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
  res.status(200).json(newSpot);
});

// start by finding a spot , create a spot image , assign its spot id to its current spot
// REVIEW IMAGES HAS A LIMIT OF 10
// ROUTER POST API / SPOT /
// DELETE

router.delete("/:spotId", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    let err = new Error("Spot could not be found");
    err.status = 404;
    throw err;
  }
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden " });
  }
  await spot.destroy();
  res.status(200).json({ message: "Successfully deleted" });
});

router.get("/:spotId/reviews", async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    res.status(404).json({
      message: "spot not found",
    });
  }
  const reviews = await Review.findAll({
    where: {
      spotId: spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });
  res.status(200).json({ Reviews: reviews });
});

router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const parsedSpotId = parseInt(spotId, 10);
  const spot = await Spot.findByPk(parsedSpotId);
  let { review, stars } = req.body;
  const rev = await Review.findOne({
    where: {
      userId: req.user.id,
      spotId: parsedSpotId,
    },
  });
  if (!review || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }
  if (!spot) {
    let err = new Error("Spot couldn't be found");
    err.status = 404;
    throw err;
  }

  if (rev) {
    res
      .status(500)
      .json({ message: "User already has a review for this spot" });
  }

  const createReview = await Review.create({
    userId: req.user.id,
    spotId: parsedSpotId,
    review,
    stars,
  });
  res.status(201).json(createReview);
});

// Get all Bookings for a Spot based on the Spot's id

// Create a Booking from a Spot based on the Spot's id

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  const bookings = await Booking.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });
  if (spot.ownerId === userId) {
    return res.status(200).json({ Bookings: bookings });
  } else {
    const newBooking = bookings.map((booking) => ({
      spotId: booking.spotId,
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));
    return res.status(200).json({ Bookings: newBooking });
  }
});

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user.id;
  const errors = {};
  const currentDate = new Date().toISOString().split("T")[0];

  // how to get current date
  if (!startDate || new Date(startDate) < new Date(currentDate)) {
    errors.startDate = "The start date must be today or later.";
  }

  if (!endDate || new Date(endDate) <= new Date(startDate)) {
    errors.endDate = "The end date must be after the start date.";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Bad Request", errors });
  }
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    res.status(404).json({ message: "spot could not be found" });
  }
  if (spot.ownerId === userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  const booked = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [newStartDate, newEndDate],
          },
        },
        {
          endDate: {
            [Op.between]: [newStartDate, newEndDate],
          },
        },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: newStartDate } },
            { endDate: { [Op.gte]: newEndDate } },
          ],
        },
      ],
    },
  });

  if (booked) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  const newBooking = await Booking.create({
    spotId,
    userId,
    startDate,
    endDate,
  });
  res.status(200).json(newBooking);
});
module.exports = router;
