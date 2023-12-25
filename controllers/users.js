/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;
const { SECRET_KEY } = process.env;

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError('Неверный email или password'));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return next(new UnauthorizedError('Неверный email или password'));
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '10d' });

    return res.status(HTTP_STATUS_OK).send({ data: { email: user.email, _id: user._id }, token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    if (error.message === 'NotAuthenticate') {
      return next(new UnauthorizedError('Неверный email или password'));
    }
    return next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await User.findById(_id);
    if (!currentUser) {
      return next(new NotFoundError('Сервер не нашел ничего, что соответствует запрошенным данным'));
    }
    return res.status(HTTP_STATUS_OK).send(currentUser);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).send(users);
  } catch (error) {
    return next(error);
  }
};

module.exports.getUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError('Сервер не нашел ничего, что соответствует запрошенным данным'));
    }
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    });
    return res.status(HTTP_STATUS_CREATED).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new ConflictError('Пользователь уже существует'));
    }
    return next(error);
  }
};

module.exports.updateUserInformation = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const updatedUserInfo = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.status(HTTP_STATUS_OK).send(updatedUserInfo);
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const updatedUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(HTTP_STATUS_OK).send(updatedUserAvatar);
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};
