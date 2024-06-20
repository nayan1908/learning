const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        validationErrors: [],
        oldInput: { email : "", password: "" }
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    bcrypt.compare(password, req.user.password).then(doMatch => {
        if (doMatch) {
            req.session.user = req.user;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
                console.log(err);
                res.redirect("/");
            })
            // res.setHeader('Set-Cookie', 'loggedIn=true');
        }
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid Password",
            validationErrors: [],
            oldInput: { email, password }
        });
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // console.log(errors.mapped())
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
            req.flash("error", "Email exists already, Please pickup different one");
            res.redirect("/signup");
        }
        return bcrypt.hash(password, 12)
            .then(hasPassword => {
                const user = new User({
                    email: email,
                    password: hasPassword,
                    cart: {
                        items: []
                    }
                });
                return user.save();
            });
    }).then(result => {
        res.redirect("/login");
    }).catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
}
