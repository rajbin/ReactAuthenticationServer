const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const keys = require('../config/keys');

module.exports = async (req, res, next) => {
    // check header or url parameters or post parameters for token
    const token = req.headers.authorization;

    if (!token) {
        // if there is no token
        // return an error
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }

    try {
        // decode token
        // verifies secret and checks exp
        const user = await jwt.verify(token, keys.jwtSecretKey);
        req.user = user;
        next();
    } catch (err) {
        return res.json({
            success: false,
            message: 'Failed to authenticate token.'
        });
    }
};
