const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const Users = require('../models/Users');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

['admin', 'user', 'contributor', 'manager'];

const sendAuthToken = async (user, res) => {
  //Generate main token
  const token = await jwt.sign(
    {
      id: user.id,
      name: user.nome,
      role: user.role,
      'https://hasura.io/jwt/claims': {
        // ? FEATURE OF USER WITH MORE THAN ONE ROLE MAY BE ADDED IN THE FUTURE
        'x-hasura-allowed-roles': ['admin', 'user', 'contributor', 'manager'],
        'x-hasura-default-role': user.role,
        'x-hasura-user-id': user.id,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  let savedRefreshToken;

  try {
    savedRefreshToken = await Users.saveRefreshToken(
      user.id,
      refreshToken,
      token
    );
  } catch (error) {
    throw error;
  }

  //SAVE REFRESH TOKEN ON COOKIES
  res.cookie('refresh_token', savedRefreshToken, {
    expires: new Date(
      Date.now() +
        process.env.JWT_REFRESH_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //! secure: true, //SET TO PRODUCTION ONLY LATER
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    token,
  });
};

const verifyToken = async (token, userFragment, next) => {
  if (!token) {
    return next(new AppError('Log in to have access', 401));
  }

  //1) Validate the token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //2) Check if the user still exist
  const user = await Users.getUserByID(decodedToken.id, userFragment);

  if (!user) {
    return next(new AppError("The users doesn't exist anymore", 401));
  }

  //3) Check if password was changed after token issued
  if (
    user.psw_changed_at &&
    parseInt(new Date(user.psw_changed_at).getTime() / 1000, 10) >
      decodedToken.iat
  ) {
    return next(new AppError('Token has expired. Log in again', 401));
  }

  return {
    user,
    decodedToken,
  };
};

exports.login = catchAsync(async (req, res, next) => {
  const { login_id, password } = req.body;

  //define regex expressions to all the the fields
  const regex_email = /^\S+@\S+$/;
  const regex_drt = /^[0-9]{5}-[0-9]{1}$/im;
  const regex_login = /^([a-z0-9_-]){5,12}$/;

  //check the login_id against the properly regex expression
  const email = regex_email.test(login_id) ? login_id : undefined;
  const drt = regex_drt.test(login_id) ? login_id : undefined;
  const login_name = regex_login.test(login_id) ? login_id : undefined;

  if (!(login_name || drt || email) || !password) {
    return next(new AppError('Bad request', 400));
  }

  const user_id = await Users.getUserIDBy(login_name, email, drt);

  if (!user_id || !(await Users.verifyPassword(user_id, password))) {
    return next(new AppError('Incorrect login data', 401));
  }

  const user = await Users.getUserByID(user_id, Users.fragments.userLogin);
  user.id = user_id;

  sendAuthToken(user, res);
});

exports.refresh_token = catchAsync(async (req, res, next) => {
  let token;
  //1) Verify if there's a token on cookies
  if (req.cookies.refresh_token) {
    token = req.cookies.refresh_token;
  }

  //2) Validate the token
  const { user, decodedToken } = await verifyToken(
    token,
    Users.fragments.userRefreshToken,
    next
  );

  //3) Check if token store in the database is equals to cookie token
  if (!(token === user.refresh_token)) {
    return next(new AppError('Token not valid. Login again', 401));
  }

  sendAuthToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  //1) Verify if there's a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //2) Validate the token
  const { decodedToken } = await verifyToken(
    token,
    Users.fragments.userCheckToken,
    next
  );

  //5) Pass some configurations to req object
  req.user_id = decodedToken.id;
  req.token = token;
  next();
});

exports.forgotPsw = catchAsync(async (req, res, next) => {
  let { email } = req.body;

  //define regex expressions to all the the fields
  const regex_email = /^\S+@\S+$/;

  //check the login_id against the properly regex expression
  email = regex_email.test(email) ? email : undefined;

  if (!email) {
    return next(new AppError('Bad request', 400));
  }

  // 1) CHECK IF THE USER EXISTIS WITH THE PROVIDES EMAIL
  const user_id = await Users.getUserIDBy(null, email, null);

  // 2) GENERATE RESET TOKEN
  await doResetToken(req, res, next, user_id);
});

const doResetToken = async (req, res, next, user_id) => {
  const { resetToken, email, nome } = await Users.saveResetToken(user_id);

  // 3) SEND EMAIL TO THE USER
  let resetUrl = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;

  if (process.env.HOST_URL) {
    resetUrl = `${process.env.HOST_URL}/reset/${resetToken}`;
  }

  try {
    await new Email({ name: nome, email }, resetUrl).sendResetPassword();
  } catch (err) {
    await Users.deleteResetToken(user_id);
    return next(new AppError('There was a error on sending email', 500));
  }

  // 4) SEND SUCESSFUL FEEDBACK TO THE USER
  res.status(200).json({
    status: 'success',
    message:
      'Token sent to your email. You have 15 minutes to reset your password',
  });
};

exports.resetPsw = catchAsync(async (req, res, next) => {
  // 1) GET RESET TOKEN FROM PARAMS
  const { resetToken } = req.params;

  const { psw, pswConfirm } = req.body;

  if (!(resetToken || psw || pswConfirm)) {
    if (psw !== pswConfirm) {
      return next(
        new AppError('Password and password confirm shoud be equal', 400)
      );
    }
    return next(new AppError('Bad request', 400));
  }

  // 2) FIND THE USER BASED ON THE RESET TOKEN
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user_id = await Users.getUserIDByResetToken(hashedToken);

  // 4) CHANGE PASSWORD IF VALID AND UPDATE psw_changed_at
  await Users.changePassword(user_id, psw);

  await Users.deleteResetToken(user_id);

  res.status(200).json({
    status: 'success',
    message: 'Your password has been changed. Login with your new credentials',
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  let token;
  // 1) Verify if there's a token on cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token == undefined || token == 'null') {
    console.log('ERROR LOGOUT');
    return next(
      new AppError('You need to provide a valid token do logout properly', 401)
    );
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  try {
    await Users.deleteRefreshToken(decodedToken.id, token);
  } catch (error) {
    console.log(error);
    throw error;
  }

  // SAVE REFRESH TOKEN ON COOKIES
  res.clearCookie('refresh_token');

  res.status(200).json({
    status: 'success',
    message: `User ${decodedToken.id} logged out`,
  });
});
