const router = require("express").Router();
const { postForm } = require("../controllers/contact");

router.post("/contactus", postForm);

module.exports = router;
