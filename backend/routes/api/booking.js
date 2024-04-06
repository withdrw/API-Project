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

router.get("/current", requireAuth , async (req, res) => {
  const userId = req.user.id;

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

  res.status(200).json({ Bookings: booking });
});

// Edit an existing booking.

router.put("/:bookingId", requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body;

  const booking = await Booking.findByPk(bookingId);

  // No booking there
  if (!booking) {
    let err = new Error("booking could not be found")
    err.status = 404
    throw err
  }

  // User does not own the booking

  if (booking.userId !== req.user.id) {
    let err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  // Message thrown when booking is checking if startDate and endDate exist
  const err = new Error("Bad Request");
  err.errors = {};

  if (!startDate) {
    err.errors.startDate = "startDate required";
    err.status = 400;
  }
  if (!endDate) {
    err.errors.endDate = "endDate required";
    err.status = 400;
  }
  if (err.status === 400) {
    throw err;
  }

  // Cant modify past bookings

  if (new Date(booking.startDate) < new Date()) {
    let err = new Error("Past bookings cant be modified");
    err.status = 403;
    throw err;
  }

  // start date can not be in the past
  if (new Date(startDate) < new Date()) {
    err.errors.startDate = "startDate can not be in the past";
    err.status = 400;
  }

  // end date can not be on or before startDate

  if (new Date(endDate) <= new Date(startDate)) {
    err.errors.endDate = "endDate can not be on or before startDate";
    err.status = 400;
  }

  if (err.status === 400) {
    throw err;
  }

  const getBookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
    },
  });

  // loop through bookings

  for (let book of getBookings) {
    // let firstDate = book.startDate;
    // let lastDate = book.endDate;
    if (book.id !== bookingId) {
      if (
        new Date(startDate) <= book.startDate &&
        new Date(startDate) >= book.endDate
      ) {
        let err = new Error("Bad Request");
        err.errors = {};
        err.errors.startDate = "Start date conflicts with an existing booking";
        err.status = 400;
      }
      if (new Date(endDate) >= book.startDate && new Date(endDate) <= book.endDate) {
        let err = new Error("Bad Request")
        err.errors = {};
        err.errors.endDate = "End date conflicts with an existing booking";
        err.status = 400;
      }
    } else {
      // checking if start date is in the past
      if (new Date(startDate) < new Date()) {
        let err = new Error("Bad Request")
        err.errors = {};
        err.errors.startDate = "startDate cannot be in the past"(
          (err.status = 400)
        );
      }
      // checking if endDate is on or before startDate

      if (new Date(endDate) <= new Date(startDate)) {
        let err = new Error('Bad Request')
        err.errors.endDate = "endDate cannot be or before startDate ";
        err.status = 400;
      }
    }
    if (err.status === 400) {
      throw err;
    }
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

  const booking = await Booking.findByPk(bookingId);
  if (booking.userId !== user.id) {
    return res.status(404).json({
      message: "Unauthorized. Booking does not belong to the current user",
    });
  }

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
