const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const Card = require('../models/card');

// HTTP_STATUS_OK 200 Запрос успешно выполнен.
// HTTP_STATUS_CREATED 201 Запрос выполнен и привел к созданию нового ресурса.
// HTTP_STATUS_BAD_REQUEST 400 Не удалось обработать запрос сервером из-за недопустимого синтаксиса.
// HTTP_STATUS_NOT_FOUND 404 Сервер не нашел ничего, что соответствует запрошенным URI.
// HTTP_STATUS_INTERNAL_SERVER_ERROR 500 Internal Server Error.

module.exports.getAllCards = async (req, res) => {
  try {
    const allCards = await Card.find({});
    return res.status(HTTP_STATUS_OK).send(allCards);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const newCard = await Card.create({ name, link, owner });
    return res.status(HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const cardDelete = await Card.findByIdAndDelete(cardId);
    if (!cardDelete) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.status(HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена' });
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

module.exports.putCardLike = async (req, res) => {
  try {
    const cardLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!cardLike) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.status(HTTP_STATUS_OK).send({ message: 'Лайк добавлен' });
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

module.exports.deleteCardLike = async (req, res) => {
  try {
    const cardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!cardDislike) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.status(HTTP_STATUS_OK).send({ message: 'Лайк удалён' });
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
