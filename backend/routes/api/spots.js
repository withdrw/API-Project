const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser , requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Spot } = require('../../db/models')

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    console.log(spots)
    res.json(spots);
})

router.get('/current', async (req, res) => {
     const spots = await Spot.findAll({
     });
    res.json(spots)
})


router.get("/:spotId", async (req, res) => {
  const spots = await Spot.findByPk(req.params.spotId);
  res.json(spots);
});

module.exports = router
