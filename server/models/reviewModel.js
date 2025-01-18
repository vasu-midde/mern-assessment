const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  movieDescription: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
