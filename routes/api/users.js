const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const BCrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

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
       let user = new User({
            username,
            password
        })
 
        const salt = await BCrypt.genSalt(10);

        user.password = await BCrypt.hash(password, salt);

        await user.save();
       
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, 
            config.get('jwtSecret'), 
            { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;
                res.json({ token })
            }
            );


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    };
});

module.exports = router;