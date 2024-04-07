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



router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;
  const newReview = await ReviewImage.findByPk(imageId, {
    include: [
      {
        model: Review,
        attributes: ["userId"],
      },
    ]
  });
  if (!newReview) {
    let err = new Error("Review Image couldn't be found");
    err.status = 404;
    throw err;
  }
  if (newReview.Review.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }


    await newReview.destroy();
    res.status(200).json({
      message: "successfully deleted",
    });
});




module.exports = router
