const router = require("express").Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserbyId } = require("../controllers/user");
const {
  getProductbyId,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  removeProduct,
  getAllProducts,
  getAllUnqCategory,
} = require("../controllers/product");

//Router  param
router.param("userId", getUserbyId);
router.param("productId", getProductbyId);

//Actual route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//Get
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//deletion of product
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAdmin,
  isAuthenticated,
  removeProduct
);

//update route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//listing route
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUnqCategory);

module.exports = router;
