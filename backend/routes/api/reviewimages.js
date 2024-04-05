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
  const newId = req.params.imageId;

  const newReview = await ReviewImage.findByPk(newId, {
    include: {
      model: Review,
      attributes: ["userId"],
    },
  });
  if (!newReview) {
    let err = new Error("Spot Image couldn't be found");
    err.status = 400;
    throw err;
  }

  if (req.user.id === newReview.Review.userId) {
    await newReview.destroy();
    res.status(200).json({
      message: "successfully deleted",
    });
  } else {
    let err = new Error("Spot does not belong to the current user ");
    throw err;
  }
});




module.exports = router
