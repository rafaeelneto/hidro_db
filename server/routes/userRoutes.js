const express = require('express');

const authController = require('../controllers/authController');
const usersController = require('../controllers/userController');

const router = express.Router();

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/create-user', authController.protect, usersController.createUser);

router.post('/refresh_token', authController.refresh_token);

router.patch('/forgotPassword', authController.forgotPsw);

router.patch('/resetPassword/:resetToken', authController.resetPsw);

module.exports = router;
