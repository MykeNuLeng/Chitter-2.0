const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../models/User')
const { check, validationResult } = require('express-validator');
const BCrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route     GET api/auth
// @desc      Test route
// @access   Public
router.get('/', auth, async (req, res) =>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (error) {
        res.status(500).json({ msg: 'Server error' })
    }
});

// @route     POST api/auth
// @desc      Authenticate user, and get a token
// @access   Public
router.post('/', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const isMatch = await BCrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
       
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