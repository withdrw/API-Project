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
  ReviewImage,
  Booking,
} = require("../../db/models");

router.get("/current", async (req, res) => {
  const userId = req.user.id;

  console.log("booking");
  const booking = await Booking.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
        include: {
          model: SpotImage,
          where: { preview: true },
          attributes: ["url"],
        },
      },
    ],
  });

  console.log("booking");

  res.status(200).json({ Bookings:  booking });
});

// Delete an existing booking.

router.delete("/:bookingId", async (req, res) => {});

module.exports = router;
