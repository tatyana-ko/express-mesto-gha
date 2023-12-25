const express = require('express');
const { json } = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, MONGO_URL } = process.env;
const { login, createUser } = require('./controllers/users');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

app.use(json());

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res, next) => next(new NotFoundError('Страница не существует')));

app.use(errors());
app.use(handleError);

mongoose.connect(MONGO_URL);

app.listen(PORT);
