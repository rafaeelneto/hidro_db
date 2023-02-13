var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');

var path = require('path');
var Multer = require('multer');

const multer = Multer({
  storage: Multer.MemoryStorage,
  fileSize: 5 * 1024 * 1024,
});

router.post(
  '/',
  authController.protect,
  multer.single('file'),
  fileController.fileUpload,
  (req, res, next) => {
    const data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.fileUrl = req.file.cloudStoragePublicUrl;
      data.id = req.file.cloudStorageObject;
    }
    res.send(data);
  }
);

router.post('/delete', authController.protect, fileController.delete);

module.exports = router;
