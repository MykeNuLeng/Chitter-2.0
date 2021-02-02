const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const BCrypt = require('bcryptjs');

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
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body;

    try {
        // Encrypt password using BCrypt

        // Return jsonwebtoken
       let user = new User({
            username,
            password
        })

        const salt = await BCrypt.genSalt(10);

        user.password = await BCrypt.hash(password, salt);
        await user.save();
        res.send('User registered');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    };
});

module.exports = router;