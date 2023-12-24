/* eslint-disable consistent-return */
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;
const SECRET_KEY = 'fnnjsnjdfs';

// HTTP_STATUS_OK 200 Запрос успешно выполнен.
// HTTP_STATUS_CREATED 201 Запрос выполнен и привел к созданию нового ресурса.
// HTTP_STATUS_BAD_REQUEST 400 Не удалось обработать запрос сервером из-за недопустимого синтаксиса.
// HTTP_STATUS_NOT_FOUND 404 Сервер не нашел ничего, что соответствует запрошенным URI.
// HTTP_STATUS_INTERNAL_SERVER_ERROR 500 Internal Server Error.

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).send({ message: 'Неверный email или password' });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).send({ message: 'Неверный email или password' });
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '10d' });

    return res.status(HTTP_STATUS_OK).send({ data: { email: user.email, _id: user._id }, token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    if (error.message === 'NotAuthenticate') {
      return res
        .status(401)
        .send({ message: 'Неверный email или password' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.name });
  }
};

module.exports.getCurrentUser = async (req, res) => {

};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).send(users);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({
        message: 'Сервер не нашел ничего, что соответствует запрошенным данным',
      });
    }
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

// module.exports.createUser = async (req, res) => {
//   try {
//     const { name, about, avatar } = req.body;

//     const newUser = await User.create({ name, about, avatar });
//     return res.status(HTTP_STATUS_CREATED).send(newUser);
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       return res
//         .status(HTTP_STATUS_BAD_REQUEST)
//         .send({ message: 'Переданы невалидные данные' });
//     }
//     return res
//       .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
//       .send({ message: 'Ошибка на стороне сервера' });
//   }
// };

// eslint-disable-next-line consistent-return
module.exports.createUser = async (req, res) => {
  try {
    // eslint-disable-next-line object-curly-newline
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
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return res
        .status(409)
        .send({ message: 'Пользователь уже существует' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.updateUserInformation = async (req, res) => {
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
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
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
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};
