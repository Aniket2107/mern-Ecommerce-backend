const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const { signout , signup , signin , isSignedIn} = require('../controllers/auth');

//Signup
router.post('/signup', [
    check('name','Name must have atleast 3 character').isLength({min:3}),
    check('email','Valid email is necessary').isEmail(),
    check('password','Password atleast 6 chars').isLength({min:6})
] ,signup);

//Login
router.post('/signin', [
    check('email','Valid email is necessary').isEmail(),
    check('password','Password atleast 6 chars').isLength({min:6})
] ,signin);

//Signout
router.get('/signout', signout);

//proetcted route
router.get('/test', isSignedIn , (req,res) => {
    res.send('Protected route');
});


module.exports = router;