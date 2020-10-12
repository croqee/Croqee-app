const jwt = require("jsonwebtoken");
const User = require("mongoose").model("User");
const PassportLocalStrategy = require("passport-local").Strategy;
const config = require("../config");
/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false,
    passReqToCallback: true
}, (req, email, cureentPassword, newPassword, done) => {
    const userData = {
        email: email.trim(),
        password: cureentPassword.trim()
    };
    // find a user by email address
    return User.findOne({ email: userData.email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            const error = new Error("Incorrect email or password");
            error.name = "IncorrectCredentialsError";
            return done(error);
        }
        // check if a hashed user's password is equal to a value saved in the database
        return user.comparePassword(userData.cureentPassword, (passwordErr, isMatch) => {
            if (passwordErr) {
                return done(err);
            }
            if (!isMatch) {
                const error = new Error("Incorrect email or password");
                error.name = "IncorrectCredentialsError";
                return done(error);
            }
            if (isMatch) {
                user.password = newPassword.trim();
                user.save(err => {
                    if (err) {
                        return done(err);
                    }
                    return done(null);
                });
            }
        });
    });
});
//# sourceMappingURL=local-changePassword.js.map