const jwt = require('jsonwebtoken');

const Users = require('../models/Users');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Email = require('../utils/email');

exports.createUser = catchAsync(async (req, res, next) => {
  const token = req.token;

  // get request input
  const {
    drt,
    email,
    login_name,
    nome,
    psw,
    pswConfirm,
    scope,
    // ? FEATURE MAY BE ADDED IN THE FUTURE
    // roles,
    role,
  } = req.body.input;

  if (!login_name && !email && !psw && !pswConfirm && !nome) {
    return next(new AppError('Bad request', 400));
  }

  const newUser = await Users.createUser(
    req.user_id,
    {
      drt,
      email,
      login_name,
      nome,
      psw,
      pswConfirm,
      scope,
      role,
      // ? FEATURE MAY BE ADDED IN THE FUTURE
      // roles,
    },
    req.token
  );

  if (newUser.errors) {
    return next(new AppError(newUser.errors[0].message, 400));
  }

  const {
    resetToken,
    email: emailUser,
    nome: nomeUser,
  } = await Users.saveResetToken(newUser.id);

  // 3) SEND EMAIL TO THE USER
  let resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/novo-usuario/${resetToken}`;

  if (process.env.HOST_URL) {
    resetUrl = `${process.env.HOST_URL}/novo-usuario/${resetToken}`;
  }

  try {
    await new Email({ name: nome, email }, resetUrl).sendNewUser();
  } catch (err) {
    await Users.deleteResetToken(newUser.id);
    return next(new AppError('There was a error on sending email', 500));
  }

  return res.json({
    email: emailUser,
    nome: nomeUser,
  });
});

exports.edit = catchAsync(async (req, res, next) => {
  const token = req.token;

  // get request input
  let {
    drt,
    email,
    login_name,
    nome,
    psw,
    pswConfirm,
    scope,
    // ? FEATURE MAY BE ADDED IN THE FUTURE
    // roles,
    role,
  } = req.body.input;

  const regex_email = /^\S+@\S+$/;
  const regex_drt = /^[0-9]{5}-[0-9]{1}$/im;
  const regex_login = /^([a-z0-9_-]){5,12}$/;

  //check the login_id against the properly regex expression
  email = regex_email.test(email) ? email : undefined;
  drt = regex_drt.test(drt) ? drt : undefined;
  login_name = regex_login.test(login_name) ? login_name : undefined;

  if (!login_name && !email && !psw && !pswConfirm && !nome) {
    return next(new AppError('Bad request', 400));
  }

  const newUser = await Users.createUser(
    req.user_id,
    {
      drt,
      email,
      login_name,
      nome,
      psw,
      pswConfirm,
      scope,
      role,
      // ? FEATURE MAY BE ADDED IN THE FUTURE
      // roles,
    },
    req.token
  );

  if (newUser.errors) {
    return next(new AppError(newUser.errors[0].message, 400));
  }

  return res.json({
    email: newUser.email,
    nome: newUser.nome,
  });
});
