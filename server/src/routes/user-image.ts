import { Router } from 'express';
import GridFs from 'gridfs-stream';
import mongoose from 'mongoose';
import * as config from '../config';

export const router = Router();

//create mongo connection
const conn = mongoose.createConnection(config.dbUri, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs: GridFs.Grid;
conn.once('open', () => {
  gfs = GridFs(conn.db, mongoose.mongo);
  gfs.collection('images');
});

router.route('/:filename').get((req, res) => {
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

module.exports = router;
