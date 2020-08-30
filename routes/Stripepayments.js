const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { makeStripePayment } = require("../controllers/Stripepayments");
const { getUserbyId } = require("../controllers/user");

router.param("userId", getUserbyId);

router.post(
  "/stripepayment/:userId",
  isSignedIn,
  isAuthenticated,
  makeStripePayment
);

module.exports = router;
