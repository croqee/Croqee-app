const express = require("express");
const User = require("mongoose").model("User");
const ImageRouter = new express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const config = require("../config");
//create mongo connection
const conn = mongoose.createConnection(config.dbUri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
});
const storage = new GridFsStorage({
    url: config.dbUri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                };
                resolve(fileInfo);
            });
        });
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024
    },
    fileFilter: fileFilter
});
ImageRouter.route("/uploaduserimg/:id").post(upload.single("image_data"), (req, res, next) => {
    const userId = req.params.id;
    let obj = {
        img: {
            image_data: req.file.filename
        }
    };
    if (req.user.img && req.user.img.imageName !== "none") {
        gfs.remove({ filename: req.user.img.image_data, root: 'images' }, (err, gridStore) => {
            if (err) {
                return res.status(404).json({ err: err });
            }
        });
    }
    User.findOneAndUpdate({ _id: userId }, obj, err => {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        }
        else {
            res.status(204).json();
        }
    });
});
module.exports = ImageRouter;
//# sourceMappingURL=images.js.map