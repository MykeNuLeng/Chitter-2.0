const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User')

// @route     POST api/users
// @desc      Register a user
// @access   Public
router.post('/', [
    check('username', 'Username is required').not().isEmpty(),
    check('username').custom((value)  => {
        return User.findOne({ username: value }).then(user => {
            if (user) {
                return Promise.reject('Username is already in use');
            };  
        }); 
    } ),
    check('password', 'Please enter a password of at least 6 characters').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body);
    res.send('User route');
});

module.exports = router;