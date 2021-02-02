import { Router } from 'express';
import * as Grid from 'gridfs-stream';
import * as mongoose from 'mongoose';
import * as config from '../config';

const ImageRouter = Router();

//create mongo connection
const conn = mongoose.createConnection(config.dbUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('images');
});

ImageRouter.route('/:filename').get((req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0 || err) {
      return res.status(404).json({
        err,
      });
    }
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gfs.createReadStream({ filename: file.filename });
      readstream.pipe(res);
    }
  });
});

module.exports = ImageRouter;
