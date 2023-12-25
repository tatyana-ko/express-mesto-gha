/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

const { SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  let payload;

  try {
    const token = req.headers.authorization;

    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, SECRET_KEY);
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('С токеном что-то не так'));
    }
  }

  req.user = payload;
  next();
};
