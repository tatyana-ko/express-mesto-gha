const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

const { createCardValidation, cardIdValidation } = require('../middlewares/validation');

router.get('/', getAllCards);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.post('/', createCardValidation, createCard);
router.put('/:cardId/likes', cardIdValidation, putCardLike);
router.delete('/:cardId/likes', cardIdValidation, deleteCardLike);

module.exports = router;
