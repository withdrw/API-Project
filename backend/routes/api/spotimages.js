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


router.delete('/:imageId', requireAuth, async (req, res) => {
  const newId = req.params.imageId
  const userId = req.user.id

  const newSpot = await SpotImage.findByPk(newId, {
    include: {
      model: Spot,
      attributes :[ 'ownerId']
    }
  })
  // console.log("THIS IS THE IMAGE",newSpot)
  if (!newSpot) {
    return res.status(404).json({ message : 'Spot image could not be found'})
  }

  if (newSpot.Spot.ownerId !== userId ) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await newSpot.destroy()
  res.status(200).json({
    message: "successfully deleted"
  })
})

module.exports = router
