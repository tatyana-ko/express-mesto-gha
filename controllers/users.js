const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require("http2").constants;
const User = require("../models/user");

// HTTP_STATUS_OK 200 Запрос успешно выполнен.
// HTTP_STATUS_CREATED 201 Запрос выполнен и привел к созданию нового ресурса.
// HTTP_STATUS_BAD_REQUEST 400 Не удалось обработать запрос сервером из-за недопустимого синтаксиса.
// HTTP_STATUS_NOT_FOUND 404 Сервер не нашел ничего, что соответствует запрошенным URI.
// HTTP_STATUS_INTERNAL_SERVER_ERROR 500 Internal Server Error.

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).send(users);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

module.exports.getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({
          message:
            "Сервер не нашел ничего, что соответствует запрошенным данным",
        });
    }
    return res.status(HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: "Переданы невалидные данные" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const newUser = await User.create({ name, about, avatar });
    return res.status(HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: "Переданы невалидные данные" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

module.exports.updateUserInformation = async (req, res) => {
  try {
    const { name, about } = req.body;

    const updatedUserInfo = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValisators: true }
    );
    return res.status(HTTP_STATUS_OK).send(updatedUserInfo);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: "Переданы невалидные данные" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    const updatedUserAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValisators: true }
    );
    return res.status(HTTP_STATUS_OK).send(updatedUserAvatar);
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: "Переданы невалидные данные" });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на стороне сервера" });
  }
};
