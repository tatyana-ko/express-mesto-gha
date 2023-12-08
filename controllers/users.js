const User = require("../models/user");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports.getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    console.log(req.body)
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).send(newUser);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports.updateUserInformation = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
  } catch (error) {}
};
