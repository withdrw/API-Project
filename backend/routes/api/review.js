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
} = require("../../db/models");

router.get("/current", async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
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
        include:
        {
          model: SpotImage,
          where: { preview: true },
          attributes: ["url"],
        },

      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });
  console.log("this is my reviews:", reviews[0]);

  res.status(200).json({ Reviews: reviews });
});

/// EDIT A REVIEW
router.put("/:reviewId", async (req, res) => {
  const reviewId = req.params.reviewId;
  const { review, stars } = req.body;

  try {
    const rev = await Review.findByPk(reviewId);

    if (!rev) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (req.user.id !== rev.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this review",
      });
    }

    if (review) {
      rev.review = review;
    }

    if (stars) {
      rev.stars = stars;
    }

    await rev.save();

    res.json(rev);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
/// DELETE REVIEWS

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findOne({
    where: { id: reviewId },
  });

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  console.log("first");
  await Review.destroy({ where: { id: reviewId } });
  res.status(200).json({ message: "Successfully deleted" });
});


router.post('/:reviewId/images', async (req, res) => {



})



module.exports = router;
