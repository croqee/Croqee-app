const express = require("express");
const User = require("mongoose").model("User");
const ImageRouter = new express.Router();
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

ImageRouter.route("/uploaduserimg/:id").post(
  upload.single("imageData"),
  (req, res, next) => {
    const userId = req.params.id;
    let obj = {
      img: {
        imageName: req.body.imageName,
        imageData: req.file.path,
      },
    };
    if (req.user.img.imageName !== "none") {
      fs.unlink(req.user.img.imageData, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
    User.findOneAndUpdate({ _id: userId }, obj, (err) => {
      if (err) {
        res.status(400).json();
      } else {
        res.status(204).json();
      }
    });
  }
);

module.exports = ImageRouter;
