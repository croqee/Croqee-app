const express = require("express");
const User = require("mongoose").model("User");
const passport = require("passport");
const config = require("../config");
const validator = require("validator");

const router = new express.Router();

let croqeeBodyParser = body => {
  var reqBody = {};
  for (var key in body) {
    reqBody = JSON.parse(key);
  }
  return reqBody;
};

router.get("/getuser", (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

//find a user by their id
router.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  User.findById({ _id: userId }, (err, user) => {
    if (user) {
      let editeduser = {
        email: user.email,
        name: user.name,
        birthDate: user.birthDate,
        city: user.city,
        behance: user.behance,
        instagram: user.instagram,
        facebook: user.facebook,
        website: user.website,
        imageName: user.img.imageName,
        imageData: user.img.imageData
      };
      res.status(200).json(editeduser);
    } else if (err) {
      res.status(400).json(err);
    } else {
      res.status(500).end();
    }
  });
});

router.post("/updateuser/:id", (req, res) => {
  const userId = req.params.id;
  req.body = croqeeBodyParser(req.body);
  User.findOneAndUpdate({ _id: userId }, req.body, err => {
    if (err) {
      return res.status(400).json({ errors: "id not found." });
    } else {
      return res.status(204).json({ success: "updated" });
    }
  });
});

router.get("/password", (req, res) => {
  const userId = req.user.id;
  User.findById({ _id: userId }, (err, user) => {
    if (err) {
      return res.status(400).json({ errors: "id not found." });
    } else if (user) {
      if (user.password !== undefined) {
        res.status(200).json(false);
      } else {
        res.status(200).json(true);
      }
    } else {
      return res.status(500).json({ errors: "internal error" });
    }
  });
});

function validatePasswordForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = "";

  if (
    !payload ||
    typeof payload.currentPassword !== "string" ||
    payload.currentPassword.trim().length === 0
  ) {
    isFormValid = false;
    errors.currentPassword = "Please provide your current password.";
  }

  if (
    !payload ||
    typeof payload.newPassword !== "string" ||
    payload.newPassword.trim().length === 0
  ) {
    isFormValid = false;
    errors.newPassword = "Please provide your new password.";
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
router.post("/password", (req, res, next) => {
  const userId = req.user.id;
  req.body = croqeeBodyParser(req.body);
  const validationResult = validatePasswordForm(req.body);
  let userPassObj = req.body;

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  User.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    }

    if (!user) {
      const error = new Error("Incorrect email or password");
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(
      userPassObj.currentPassword,
      (passwordErr, isMatch) => {
        if (passwordErr) {
          res.status(400).json(err);
        }

        if (!isMatch) {
          const error = new Error("Incorrect password");
          res.status(400).json(error);
        }

        if (isMatch) {
          user.password = userPassObj.newPassword.trim();
          user.save(err => {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(200).json({ msg: "success" });
            }
          });
        }
      }
    );
  });
});

router.delete("/account", (req, res) => {
  const userId = req.user.id;
  User.findOneAndDelete({ _id: userId }, err => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      res.status(204).end();
    }
  });
});
module.exports = router;
