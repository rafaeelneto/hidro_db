const express = require('express');
const path = require('path');
const gql = require('graphql-tag');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

const fgdcTextures = require('./data/fgdc_textures');

const AppError = require('./utils/appError');

const errorHandler = require('./controllers/errorHandler');

const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const gqlClient = require('./graph-client/client');

const app = express();

// SET SECURITY HEADERS
app.use(helmet());

// TODO: SET THIS IN THE FUTURE TO ACCEPT OTHER DOMAINS
// app.use(cors());
app.use(cors({ credentials: true, origin: true }));
// app.options('*', cors());
// app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );

//PARSE DATA FROM BODY TO REQ.BODY
// app.use(express.json());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb' }));
app.use(cookieParser());

//DATA SANITIZATION AGAINST XSS
app.use(xss());

//LIMIT THE QUANTITY OF REQUEST FROM AN IP
const limiter = rateLimit({
  max: 100,
  windowMs: 300 * 1000, //5 minutos
  message: 'Too many requests by your IP, please try again later',
});

app.use(express.static(path.join(__dirname, '/public/build')));

app.use('/v1/api/user', limiter);
app.use('/v1/api/file-upload', limiter);

app.use(morgan('dev'));

app.post('/v1/api/fgdc-textures', (req, res, next) => {
  const { textures } = req.body;

  if (!textures) {
    return next(new AppError('Não foram recebidas texturas', 400));
  }

  const texturesRes = {};

  textures.forEach((textureCode) => {
    if (fgdcTextures[textureCode]) {
      texturesRes[textureCode] = fgdcTextures[textureCode];
    }
  });

  res.status(200).json({
    status: 'success',
    data: texturesRes,
  });
});

app.use('/v1/api/user', userRoutes);

app.use('/v1/api/file-upload', fileRoutes);

app.use('/*', express.static(path.join(__dirname, '/public/build')));

app.all('*', (req, res, next) => {
  next(
    new AppError(`Can't find the route ${req.originalUrl} on the server`, 404)
  );
});

app.use(errorHandler);

module.exports = app;
