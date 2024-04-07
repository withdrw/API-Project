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

  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

    const booked = await Booking.findOne({
      where: {
        id : {[Op.ne]: bookingId},
        spotId : booking.spotId,
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

  const updateBooking = await booking.update({
    startDate,
    endDate,
  });

  res.json(updateBooking);
});

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;

  const booking = await Booking.findByPk(bookingId, {
    include: {
      model: Spot,
      attributes : ['ownerId']
    }

  });
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  const realDate = new Date()

  if (realDate >= new Date(booking.startDate)) {
    return res.status(403).json({
      message: "Bookings that have been started cannot be deleted",
    });
  }
  await booking.destroy();
  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
