const express = require('express');
const {json} = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

app.use(json());
app.use((req, res, next) => {
  req.user = {
    _id: '6573447c047ef8d23052c750'
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  res.status(404).send({ message: "Страница не существует"});

  next();
})


mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT);
