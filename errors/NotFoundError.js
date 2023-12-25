// 404 - Пользователь, карточка по данному корректному ID не найдены

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
