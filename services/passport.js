const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const User = mongoose.model('user');

// create local startegy
const localLoginStrategy = new LocalStrategy(
    async (username, password, done) => {
        // verify the email and password, if correct, call done with the user
        // otherwise, call done with false
        const user = await User.findOne({ email: username });
        if (!user) {
            return done(null, false);
        }

        // compare candidate password with db password
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
);

// Tell passport to use this strategy
passport.use(localLoginStrategy);
