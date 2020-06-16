const express = require("express");
const User = require("mongoose").model("User");

const router = new express.Router();

let croqeeBodyParser = (body) => {
  var reqBody = {};
  for (var key in body) {
    reqBody = JSON.parse(key);
  }
  return reqBody;
};

router.get("/getuser", (req, res) => {
  res.status(200).json({
    user: req.user,
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
        imageData: user.img.imageData,
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
  User.findOneAndUpdate({ _id: userId }, req.body, (err) => {
    if (err) {
      return res.status(400).json({ errors: "id not found." });
    } else {
      return res.status(204).json({ success: "updated" });
    }
  });
});
module.exports = router;
