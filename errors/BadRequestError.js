// 400 Не удалось обработать запрос сервером из-за недопустимого синтаксиса

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
