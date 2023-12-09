const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Поле name обязательно для заполнения'
    },
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  link: {
    type: String,
    required: {
      value: true,
      message: 'Поле link обязательно для заполнения'
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {versionKey: false});

module.exports = mongoose.model('card', cardSchema);