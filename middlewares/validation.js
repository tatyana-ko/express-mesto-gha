/* eslint-disable no-useless-escape */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { celebrate, Joi } = require('celebrate');

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]+#?)$/,),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]+#?)$/,).required(),
  }),
});
