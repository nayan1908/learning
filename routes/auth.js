const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");

router.get('/login', authController.getLogin);
router.post('/login',
    check('email', "Please enter valid email").isEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(user => {
                if (!user) {
                    return Promise.reject("Invalid email");
                }
                req.user = user;
            });
        }),
    authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email').isEmail()
            .withMessage('Please enter valid email')
            .custom((value, { req }) => {
                // if (value === "test@test.com") {
                //     throw new Error("This email address is forbidden.");
                // }
                // return true;

                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject("Email exists already, Please pickup different one");
                    }
                });
            }),
        body('password', "Please enter a password with only number and text and at least 5 characters.")
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password have to match");
            }
            return true;
        })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;
