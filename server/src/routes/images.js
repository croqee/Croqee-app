const express = require("express");
const User = require("mongoose").model("User");
const Image = require("mongoose").model("ImageSchema");
const ImageRouter = new express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
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
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

ImageRouter.route("/uploadmulter/:id").post(
  upload.single("imageData"),
  (req, res, next) => {
    console.log("sonia");
    //find the user first
    const userId = req.params.id;
    console.log(userId);
    let obj = {
      img: {
        imageName: req.body.imageName,
        imageData: req.file.path
      }
    };
    User.findOneAndUpdate({ _id: userId }, obj, err => {
      if (err) {
        res.status(400).json();
      } else {
        res.status(204).json();
      }
    });
  }
);

module.exports = ImageRouter;
