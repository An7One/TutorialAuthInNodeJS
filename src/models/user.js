import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// to authenticate input against database
UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({ email: email })
        .exec((err, user) => {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error("User not found");
                err.status = 404;
                return callback(err);
            }
            bcrypt.compare(password,
                user.password,
                (err, result) => {
                    if (result === true) {
                        return callback(null, user);
                    } else {
                        return callback();
                    }
                })
        });
}

// to hash a password before saving it to the database
UserSchema.pre('save', (next) => {
    var user = this;
    bcrypt.hash(user.password,
        10,
        (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
});

var User = mongoose.model('User', UserSchema)
module.exports = User

