const router = require("express").Router();

const {
  getCategorybyId,
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserbyId } = require("../controllers/user");

router.param("userId", getUserbyId);
router.param("categoryId", getCategorybyId);

router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//update
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//delete
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

module.exports = router;
