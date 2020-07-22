const express = require("express");
const validator = require("validator");
const passport = require("passport");
const { google } = require("googleapis");
const User = require("mongoose").model("User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const graph = require("fbgraph");
const router = new express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");

let croqeeBodyParser = body => {
  var reqBody = {};
  for (var key in body) {
    reqBody = JSON.parse(key);
  }
  return reqBody;
};

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = "";

  if (
    !payload ||
    typeof payload.email !== "string" ||
    !validator.isEmail(payload.email)
  ) {
    isFormValid = false;
    errors.email = "Please provide a correct email address.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < 8
  ) {
    isFormValid = false;
    errors.password = "Password must have at least 8 characters.";
  }

  if (
    !payload ||
    typeof payload.name !== "string" ||
    payload.name.trim().length === 0
  ) {
    isFormValid = false;
    errors.name = "Please provide your name.";
  }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = "";

  if (
    !payload ||
    typeof payload.email !== "string" ||
    payload.email.trim().length === 0
  ) {
    isFormValid = false;
    errors.email = "Please provide your email address.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length === 0
  ) {
    isFormValid = false;
    errors.password = "Please provide your password.";
  }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post("/signup", (req, res, next) => {
  req.body = croqeeBodyParser(req.body);
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate("local-signup", err => {
    if (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: "Check the form for errors.",
          errors: {
            email: "This email is already taken."
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: "Could not process the form."
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "You have successfully signed up! Now you should be able to log in."
    });
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  req.body = croqeeBodyParser(req.body);
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate("local-login", (err, token, userData) => {
    if (err) {
      if (err.name === "IncorrectCredentialsError") {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: "Could not process the form."
      });
    }

    return res.json({
      success: true,
      message: "You have successfully logged in!",
      token,
      user: userData
    });
  })(req, res, next);
});

//google authentications
router.post("/googleauth", (req, res, next) => {
  const googleCode = req.body.googleCode;
  const oauth2Client = new google.auth.OAuth2(
    "701118539942-qhfj5072bdipbp3gj12ki3ol6hg5mhme.apps.googleusercontent.com",
    "iSUe2zKU12P8H1u8TE5O0B4Y",
    "postmessage"
  );
  google.options({ auth: oauth2Client });
  oauth2Client
    .getToken(googleCode)
    .then(res => {
      const tokens = res.tokens;
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: "v2" });
      return oauth2.userinfo.get();
    })
    .then(userData => {
      const googleId = userData.data.id;
      const googleMail = userData.data.email;
      //check if user has already logged in with their google id before
      User.findOne({ email: googleMail }, (err, userByEmail) => {
        if (userByEmail) {
          //log the user in there
          const token = jwt.sign(userByEmail.id, config.jwtSecret);
          res.json({
            success: true,
            message: "You have successfully logged in!",
            token,
            user: {
              name: userByEmail.name
            }
          });
        } else {
          User.findOne({ googleId: googleId }, (error, userById) => {
            if (userById) {
              //log the user in there
              const token = jwt.sign(userById.id, config.jwtSecret);
              res.status(200).json({
                success: true,
                message: "You have successfully logged in!",
                token,
                user: { name: userById.name }
              });
            } else {
              //create a new account
              const userInfo = {
                name: userData.data.name,
                email: googleMail,
                googleId: googleId
              };
              const newUser = new User(userInfo);
              newUser.save(err => {
                if (err) {
                  //send err msg
                  res.json({
                    success: false,
                    message: "There was an issue with your google login!"
                  });
                } else {
                  const token = jwt.sign(newUser.id, config.jwtSecret);
                  res.json({
                    success: true,
                    message: "You have successfully logged in!",
                    token,
                    user: {
                      name: newUser.name
                    }
                  });
                }
              });
            }
          });
        }
      });
    })
    .catch(err => res.json("error" + err));
});

//facebook Authentication
router.post("/facebookauth", (req, res) => {
  graph.authorize(
    {
      client_id: "641364966683591",
      redirect_uri: "",
      client_secret: "1dc9cc0665cd8f6c0a4dd0a4ede05d0f",
      code: req.body.facebookCode
    },
    function(err, facebookRes) {
      if (facebookRes) {
        graph.get("/me?fields=email,id,name", (err, userData) => {
          if (userData) {
            const fbId = userData.id;
            const fbmail = userData.email;
            User.findOne({ email: fbmail }, (err, userByEmail) => {
              if (userByEmail) {
                //log the user in there
                const token = jwt.sign(userByEmail.id, config.jwtSecret);
                res.json({
                  success: true,
                  message: "You have successfully logged in!",
                  token,
                  user: {
                    name: userByEmail.name
                  }
                });
              } else {
                User.findOne({ fbId: fbId }, (error, userById) => {
                  if (userById) {
                    //log the user in there
                    const token = jwt.sign(userById.id, config.jwtSecret);
                    res.status(200).json({
                      success: true,
                      message: "You have successfully logged in!",
                      token,
                      user: { name: userById.name }
                    });
                  } else {
                    //create a new account
                    const userInfo = {
                      name: userData.name,
                      email: fbmail,
                      fbId: fbId
                    };
                    const newUser = new User(userInfo);
                    newUser.save(err => {
                      if (err) {
                        //send err msg
                        res.json({
                          success: false,
                          message: "There was an issue with your google login!"
                        });
                      } else {
                        const token = jwt.sign(newUser.id, config.jwtSecret);
                        res.json({
                          success: true,
                          message: "You have successfully logged in!",
                          token,
                          user: {
                            name: newUser.name
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  );
});

//forgot password get link
router.post("/account", (req, res) => {
  const parsedBody = croqeeBodyParser(req.body);
  if (parsedBody.email === "") {
    res.status(400).send("email required");
  }
  User.findOne({
    email: parsedBody.email
  }).then(user => {
    // console.log("to check the email:" + user.email);
    if (user === null) {
      res.status(403).send("email not in db");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      const expiryTime = Date.now() + 360000;
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiryTime;
      user.save(function(err) {
        if (err) {
          return res.status(500).json({error: err})
        } 
      });
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "croqee@gmail.com",
          pass: "bncmztxpzyqefavk"
        }
      });
      const mailOptions = {
        from: "croqee@gmail.com",
        to: `${user.email}`,
        subject: "Link To Reset Password",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `http://localhost:3000/reset/${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n"
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          res.status(500).json({error: err});
        } else {
          res.status(200).json("recovery email sent");
        }
      });
    }
  });
});

router.get("/reset-token-check", (req, res, next) => {
  User.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  }).then(user => {
    if (!user) {
      res.status(400).json("password reset link is invalid or has expired");
    } else {
      res.status(200).send({
        email: user.email,
        message: "password reset link a-ok"
      });
    }
  });
});

let myBodyParser = body => {
  var reqBody = {};
  for (var key in body) {
    reqBody = JSON.parse(key);
  }
  return reqBody;
};

router.put("/reset-pass", (req, res) => {
  req.body = myBodyParser(req.body);
  User.findOne({
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
    email: req.body.email
  }).then(user => {
    if (!user) {
      res.status(400).json("password reset link is invalid or has expired");
    } else {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.save(function(err, obj) {
        if (err) {
          res.status(500).end();
        } else {
          res.status(200).send({
            message: "password successfully updated"
          });
        }
      });
    }
  });
});
module.exports = router;
