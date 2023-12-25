const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// HTTP_STATUS_OK 200 Запрос успешно выполнен.
// HTTP_STATUS_CREATED 201 Запрос выполнен и привел к созданию нового ресурса.
// HTTP_STATUS_BAD_REQUEST 400 Не удалось обработать запрос сервером из-за недопустимого синтаксиса.
// HTTP_STATUS_NOT_FOUND 404 Сервер не нашел ничего, что соответствует запрошенным URI.
// HTTP_STATUS_INTERNAL_SERVER_ERROR 500 Internal Server Error.

module.exports.getAllCards = async (req, res, next) => {
  try {
    const allCards = await Card.find({});
    return res.status(HTTP_STATUS_OK).send(allCards);
  } catch (error) {
    return next(error);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const newCard = await Card.create({ name, link, owner });
    return res.status(HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    if (userId !== card.owner.toString()) {
      return next(new ForbiddenError('Невозможно удалить чужую карточку'));
    }

    const cardToDelete = await Card.findByIdAndDelete(cardId);
    if (!cardToDelete) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

module.exports.putCardLike = async (req, res, next) => {
  try {
    const cardLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!cardLike) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(HTTP_STATUS_OK).send({ message: 'Лайк добавлен' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

module.exports.deleteCardLike = async (req, res, next) => {
  try {
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardDislike) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(HTTP_STATUS_OK).send({ message: 'Лайк удалён' });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};
