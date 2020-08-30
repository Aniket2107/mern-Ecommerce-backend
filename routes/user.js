const router = require('express').Router();
const {getUser , getUserbyId ,updateUser , userPurchaseList } = require('../controllers/user');
const {isSignedIn, isAuthenticated,isAdmin} = require('../controllers/auth');

router.param('userId', getUserbyId);

router.get('/user/:userId',isSignedIn,isAuthenticated,getUser);
router.put('/user/:userId',isSignedIn,isAuthenticated,updateUser);
router.get('/user/order/:userId',isSignedIn,isAuthenticated,userPurchaseList);

module.exports = router;