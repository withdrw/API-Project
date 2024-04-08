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

router.get("/current", requireAuth, async (req, res) => {
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
        include: [
          {
            model: SpotImage,
            // where: { preview: true },
            attributes: ["url"],
          },
        ]
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
    ],
  });

  res.status(200).json({ Reviews : reviews });
});

/// EDIT A REVIEW
router.put("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { review, stars } = req.body;
  const rev = await Review.findByPk(reviewId);
    if (!review || stars < 1 || stars > 5) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: "Review text is required",
          stars: "Stars must be an integer from 1 to 5",
        },
      });
    }

      if (!rev) {
        return res.status(404).json({
          message: "Review couldn't be found",
        });
      }
  if (rev.userId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
    // if (review) {
    //   rev.review = review;
    // }

    // if (stars) {
    //   rev.stars = stars;
    // }

    await rev.update({review,stars});

    return res.status(200).json(rev);
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
      if (review.userId !== req.user.id) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }

  await Review.destroy({ where: { id: reviewId } });
  res.status(200).json({ message: "Successfully deleted" });
});

///reviews/:reviewId/images
//  WORKS BUT STILL COULD USE SOME DEBUGGING
router.post('/:reviewId/images', requireAuth, async(req, res) => {
  const reviewId = parseInt(req.params.reviewId)
  const review = await Review.findByPk(reviewId);
  const { url } = req.body

  if (!review){
    res.status(404)
    return res.json({
      message: "Review couldn't be found"
    })
  }
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
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
