const path = require('path');
const { Storage } = require('@google-cloud/storage');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const fs = require('fs');

const gcs = new Storage({
  projectId: 'HIDRO-db',
  keyFilename: path.join(__dirname, '../cred.json'),
});

const bucketName = 'hidro_db_files';
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

exports.fileUpload = catchAsync(async (req, res, next) => {
  if (!req.file)
    return next(
      new AppError('You need to upload a valid file and valid metadatas', 403)
    );

  // Can optionally add a path to the gcsname below by concatenating it before the filename
  const gcsname = Date.now() + '_' + req.file.originalname.replace(/\s/g, '');
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;

    return next(
      new AppError('Não foi possível fazer upload do arquivo', err.code)
    );
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
});

exports.delete = catchAsync(async (req, res, next) => {
  const { file_name } = req.body;

  try {
    if (!file_name) return next(new AppError('Provide a valid file name', 403));

    await bucket.file(file_name).delete();

    res.status(200).json({
      status: 'success',
      message: `File ${file_name} DELETED`,
    });
  } catch (err) {
    return next(new AppError('Não foi possível DELETAR o arquivo', err.code));
  }
});
