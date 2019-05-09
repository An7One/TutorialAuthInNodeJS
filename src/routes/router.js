import express from 'express'
var router = express.Router()
import User from '../models/user'

// GET route to read data
router.get('/', (req, res, next) => {
    return res.sendFile(path.join(__dirname
        + '/templateLogReg/index.html'));
});

// POST route to update data
router.post('/', (req, res, next) => {
    if (req.body.password != req.body.passwordConf) {
        var err = new Error('Password does not match');
        err.status = 400;
        res.send("Passwords don't match");
        return next(err);
    }

    if (req.body.email
        && req.body.username
        && req.body.password
        && req.body.passwordConf) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }

        User.create(userData, (err, user) => {
            if (err) {
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail,
            req.body.logpassword,
            (err, user) => {
                if (err || !user) {
                    var err = new Error('Wrong email or password.');
                    err.status = 401;
                    return next(err);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/profile');
                }
            });
    } else {
        var err = new Error("All fields are required");
        err.status = 400;
        return next(err);
    }
})

// GET route after registration
router.get('/profile', (req, res, next) => {
    User.findById(req.session.userId)
        .exec((err, user) => {
            if (err) {
                return next(err)
            } else {
                if (user === null) {
                    var err = new Error('Not authorized!')
                    err.status = 400
                    return next(err)
                } else {
                    return res.send('<h1>Name: </h1>'
                        + user.username + '<h2>Mail: </h2>'
                        + user.email + '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
})

// GET to logout
router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return next(err)
            } else {
                return res.redirect('/')
            }
        })
    }
})

module.exports = router