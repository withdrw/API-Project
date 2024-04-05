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
        include: {
          model: SpotImage,
          // where: { preview: true },
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
router.put("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { review, stars } = req.body;



  const rev = await Review.findByPk(reviewId);
  if (reviewId !== req.user.id) {
    return res.status(404).json({
      message: "Unauthorized. Review does not belong to the current user",
    });
  }

    if (!review) {
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
});
/// DELETE REVIEWS

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findOne({
    where: { id: reviewId },
  });
      if (review.userId !== req.user.id) {
        return res.status(404).json({
          message: "Unauthorized. Review does not belong to the current user",
        });
      }

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  console.log("first");
  await Review.destroy({ where: { id: reviewId } });
  res.status(200).json({ message: "Successfully deleted" });
});

///reviews/:reviewId/images
//  WORKS BUT STILL COULD USE SOME DEBUGGING
router.post('/:reviewId/images', requireAuth, async(req, res) => {
  const reviewId = req.params.reviewId
  const review = await Review.findByPk(reviewId);
  const { url } = req.body

    if (review.userId !== req.user.id) {
      return res.status(404).json({
        message: "Unauthorized. Review does not belong to the current user",
      });
    }


  if (!review){
    res.status(404)
    return res.json({
      message: "Review couldn't be found"
    })
  }
  const allImages = await ReviewImage.count({
    where: {
      reviewId
    }
  })
  if (allImages >= 10){
    res.status(403).json({
      message: "Maximum number of images for this resource was reached"
    })
  }
  if (req.user.id === review.userId){
    const newImg = await ReviewImage.create({
      reviewId: review.id, url: url
    })
    return res.json({
      id: newImg.id,
      url
    })
  } else {
    res.status(403).json({
      message: "Forbidden"
    })
  }
})




module.exports = router;
