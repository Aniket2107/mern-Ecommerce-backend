const router = require("express").Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserbyId } = require("../controllers/user");
const { processPayment, generateToken } = require("../controllers/btpayments");

router.param("userId", getUserbyId);

router.get(
  "/payment/gettoken/bt/:userId",
  isSignedIn,
  isAuthenticated,
  generateToken
);

router.post("/payment/bt/:userId", isSignedIn, isAuthenticated, processPayment);

module.exports = router;
