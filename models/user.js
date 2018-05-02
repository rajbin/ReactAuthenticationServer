const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    createdTs: { type: Date, default: Date.now() }
});

// on save hookup, encrypt password
userSchema.pre('save', function(next) {
    const user = this;

    // return if user's password has not changed. we don’t want to double encrypt a password.
    //if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

mongoose.model('user', userSchema);
