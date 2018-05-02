const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const User = mongoose.model('user');

function generateTokenForUser(user) {
    const payload = {
        id: user._id,
        iat: new Date().getTime()
    };
    return jwt.sign(payload, keys.jwtSecretKey, {
        expiresIn: 86400 // 1 day
    });
}

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(422)
                .send({ error: 'You must provide email and password' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).send({ error: 'Email already in use' });
        }
        const user = new User({
            email,
            password
        });
        await user.save();
        res.send('You have registered successfully!');
    } catch (err) {
        res.status(422).send(err);
    }
};

exports.login = async (req, res) => {
    res.send({ token: generateTokenForUser(req.user) });
};
