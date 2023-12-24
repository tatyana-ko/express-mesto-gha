const jwt = require('jsonwebtoken');

const SECRET_KEY = 'fnnjsnjdfs';

module.exports = (req, res, next) => {
  let payload;

  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, SECRET_KEY);
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'С токеном что-то не так' });
    }
  }

  req.user = payload;
  next();
};
