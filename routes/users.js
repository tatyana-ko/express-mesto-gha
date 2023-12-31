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
  getUserByIdValidation,
} = require('../middlewares/validation');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUserByIdValidation, getUserByID);
router.patch('/me', updateUserInfoValidation, updateUserInformation);
router.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

module.exports = router;
