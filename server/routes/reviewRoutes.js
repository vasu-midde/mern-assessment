const express = require('express');
const { addReview, getReviews, updateReview,deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addReview);
router.get('/', protect, getReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview); // Delete review (admin only)

module.exports = router;
