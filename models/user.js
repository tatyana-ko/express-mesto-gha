const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Поле name обязательно для заполнения',
    },
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  about: {
    type: String,
    required: {
      value: true,
      message: 'Поле about обязательно для заполнения',
    },
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  avatar: {
    type: String,
    required: {
      value: true,
      message: 'Поле avatar обязательно для заполнения',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
