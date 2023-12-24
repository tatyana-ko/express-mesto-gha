const router = require('express').Router();
const {
  getAllUsers,
  getUserByID,
  updateUserInformation,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  updateUserInfoValidation,
  updateUserAvatarValidation,
} = require('../middlewares/validation');

router.get('/', getAllUsers);
router.get('/:id', getUserByID);
router.get('/me', getCurrentUser);
router.patch('/me', updateUserInfoValidation, updateUserInformation);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = router;
