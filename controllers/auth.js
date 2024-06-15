const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.redirect("/login");
            }

            bcrypt.compare(password, user.password).then(doMatch => {
                if(doMatch){
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect("/");
                    })
                    // res.setHeader('Set-Cookie', 'loggedIn=true');
                }
                res.redirect("/login");
            })
        }).catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword

    User.findOne({ email: email }).then(userDoc => {
        if (userDoc) {
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
