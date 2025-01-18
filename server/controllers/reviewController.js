const Review = require('../models/reviewModel');

// Add a movie review
const addReview = async (req, res) => {
  const { movieName, movieDescription, rating } = req.body;

  try {
    const review = await Review.create({
      movieName,
      movieDescription,
      rating,
      user: req.user.id
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
};

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { movieName, movieDescription, rating } = req.body;

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    review.movieName = movieName || review.movieName;
    review.movieDescription = movieDescription || review.movieDescription;
    review.rating = rating || review.rating;

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
};

// Delete a review (admin only)
// Delete a review (admin only)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Allow deletion only if the user is the creator of the review or an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Use deleteOne instead of remove
    await Review.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Review removed' });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
};


module.exports = { addReview, getReviews, updateReview, deleteReview };
