import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    movieName: '',
    movieDescription: '',
    rating: '',
  });
  const [editReview, setEditReview] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch reviews and decode token on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/reviews', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews', err);
      }
    };

    // Decode token to get the user's role
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === 'admin'); // Check role and set isAdmin state
    }

    fetchReviews();
  }, []);

  // Handle the creation of a new review
  const handleCreateReview = async () => {
    try {
      const { data } = await axios.post(
        'http://localhost:8080/api/reviews',
        newReview,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setReviews([...reviews, data]);
      setNewReview({
        movieName: '',
        movieDescription: '',
        rating: '',
      }); // Reset the form after submission
    } catch (err) {
      console.error('Error creating review', err);
    }
  };

  // Handle the update of a review
  const handleUpdateReview = async (reviewId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/reviews/${reviewId}`,
        editReview,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setReviews(
        reviews.map((review) =>
          review._id === reviewId ? { ...review, ...data } : review
        )
      );
      setEditReview(null); // Reset edit review state after update
    } catch (err) {
      console.error('Error updating review', err);
    }
  };

  // Handle the deletion of a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review', err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* Create Review Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Review</h3>
        <input
          type="text"
          placeholder="Movie Name"
          value={newReview.movieName}
          onChange={(e) => setNewReview({ ...newReview, movieName: e.target.value })}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          placeholder="Movie Description"
          value={newReview.movieDescription}
          onChange={(e) =>
            setNewReview({ ...newReview, movieDescription: e.target.value })
          }
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="number"
          placeholder="Rating (0-5)"
          value={newReview.rating}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value >= 0 && value <= 5) {
              setNewReview({ ...newReview, rating: e.target.value });
            }
          }}
          min="0"
          max="5"
          step="0.1"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={handleCreateReview}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Add Review
        </button>
      </div>

      {/* Display Reviews */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Reviews</h3>
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review._id} className="p-4 border rounded-lg bg-gray-50">
              <strong className="text-lg font-bold text-gray-800">{review.movieName}</strong> -{' '}
              <span className="text-green-600">{review.rating}</span>
              <br />
              {review.user && (
                <div className="text-sm text-gray-600">
                  <em>By: {review.user.name}</em> - {review.user.role}
                </div>
              )}
              {editReview && editReview._id === review._id ? (
                <div className="mt-4">
                  <input
                    type="text"
                    value={editReview.movieName}
                    onChange={(e) =>
                      setEditReview({ ...editReview, movieName: e.target.value })
                    }
                    className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <input
                    type="text"
                    value={editReview.movieDescription}
                    onChange={(e) =>
                      setEditReview({ ...editReview, movieDescription: e.target.value })
                    }
                    className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <input
                    type="number"
                    value={editReview.rating}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value >= 0 && value <= 5) {
                        setEditReview({ ...editReview, rating: e.target.value });
                      }
                    }}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full p-3 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <button
                    onClick={() => handleUpdateReview(review._id)}
                    className="mr-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditReview(null)}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <button
                    onClick={() => setEditReview(review)}
                    className="mr-2 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
