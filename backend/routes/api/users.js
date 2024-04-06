const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();
// backend/routes/api/users.js
// ...
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// ...

// backend/routes/api/users.js
// ...
const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required"),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("firstName is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage(" last name is required"),
  check("lastName")
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];
// backend/routes/api/users.js
// ...
// backend/routes/api/users.js
// ...

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);


  const userExists = await User.findOne({
    where: { username }
  })
  const mailExists = await User.findOne({
    where: { email }
  })


  if (userExists || mailExists) {
    let err = new Error('User already exists')
    err.status = 500
    err.errors = {}
    if (userExists)err.errors.username = 'User with that name email already exists'

    if (mailExists) err.errors.email = 'User with that name email already exists'

    throw err

  }


  const user = await User.create({
    email,
    firstName,
    lastName,
    username,
    hashedPassword,
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});
// Sign up
// router.post(
//   '/',
//   async (req, res) => {
//     const { email, password, username } = req.body;
//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ email, username, hashedPassword });

//     const safeUser = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//       user: safeUser
//     });
//   }
// );

module.exports = router;
