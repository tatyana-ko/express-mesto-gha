// 409 - Попытка зарегистрировать вторую учетную запись на тот же email

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
