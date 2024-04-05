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
        include: [
          {
            model: SpotImage,
            // where: { preview: true },
            attributes: ["url"],
          },
        ],
      },
    ],
  });

  console.log("booking");

  res.status(200).json({ Bookings: booking });
});

// Edit an existing booking.

router.put("/:bookingId", requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate, spotId, userId } = req.body;
  const { user } = req;
      if (booking.userId !== user.id) {
        return res.status(404).json({
          message: "Unauthorized. Booking does not belong to the current user",
        });
      }

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking could not be found",
    });
  }

  if (user.id !== booking.userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const getBookings = await Booking.findAll({
    where: {
      id: bookingId,
    },
  });
  if (booking) {
    for (let book of getBookings) {
      let firstDate = book.startDate;
      let lastDate = book.endDate;
      if (
        (startDate <= firstDate && endDate >= lastDate) ||
        (startDate >= firstDate && startDate < lastDate) ||
        (endDate > firstDate && endDate <= lastDate) ||
        (startDate >= firstDate && endDate <= lastDate)
      ) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }
    }

    // booking.startDate = startDate;
    // booking.endDate = endDate;

    // res.json(booking);
  }
  const updateBooking = await booking.update({
    startDate,
    endDate,
  });

  res.json(updateBooking);
});

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
    if (booking.userId !== user.id) {
      return res.status(404).json({
        message: "Unauthorized. Booking does not belong to the current user",
      });
    }

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  const spot = await Spot.findByPk(booking.spotId);

  if (!spot) {
    return res
      .status(404)
      .json({ message: "Spot for the booking couldn't be found" });
  }

  if (userId === booking.userId || userId === spot.ownerId) {
    const currentDate = new Date();
    const bookingStartDate = new Date(booking.startDate);

    if (bookingStartDate > currentDate) {
      await booking.destroy();

      return res.json({ message: "Successfully deleted" });
    } else {
      return res.status(403).json({
        message: "Bookings that have been started cannot be deleted",
      });
    }
  } else {
    return res.status(403).json({
      message:
        "Unauthorized - Booking does not belong to the current user or the Spot does not belong to the current user",
    });
  }
});

module.exports = router;
