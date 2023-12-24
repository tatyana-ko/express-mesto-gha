const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: {
      value: true,
      message: 'Поле email обязательно для заполнения',
    },
    unique: true,
    validator: validator.isEmail,
  },
  password: {
    type: String,
    required: {
      value: true,
      message: 'Поле password обязательно для заполнения',
    },
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
