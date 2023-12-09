const router = require("express").Router();
const {
  getAllUsers,
  getUserByID,
  createUser,
  updateUserInformation,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.get("/:id", getUserByID)
router.post("/", createUser);
router.patch("/me", updateUserInformation);
router.patch("/me/avatar", updateUserAvatar);

module.exports = router;
