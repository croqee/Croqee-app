import { randomBytes } from 'crypto';
import path from 'path';
import { Router } from 'express';
import GridFs from 'gridfs-stream';
import * as mongoose from 'mongoose';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';
import * as config from '../config';

const User = mongoose.model('User');
const router = Router();
//create mongo connection
const conn = mongoose.createConnection(config.dbUri, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs: GridFs.Grid;
void conn.once('open', () => {
  gfs = GridFs(conn.db, mongoose.mongo);
  gfs.collection('images');
});

const storage = new GridFsStorage({
  url: config.dbUri,
  file: (_req, file) => {
    return new Promise((resolve, reject) => {
      randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          bucketName: 'images',
          filename,
        };
        resolve(fileInfo);
      });
    });
  },
});
const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  storage,
});

router
  .route('/uploaduserimg/:id')
  .post(upload.single('image_data'), (req, res) => {
    const userId = req.params.id;
    const obj = {
      img: {
        image_data: req.file.filename,
      },
    };
    if (req.user.img && req.user.img.imageName !== 'none') {
      gfs.remove(
        { filename: req.user.img.image_data, root: 'images' },
        (err) => {
          if (err) {
            return res.status(404).json({ err });
          }
        },
      );
    }
    User.findOneAndUpdate({ _id: userId }, obj, (err) => {
      if (err) {
        console.log(err);
        res.status(400).json(err);
      } else {
        res.status(204).json();
      }
    });
  });
