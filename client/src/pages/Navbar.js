import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Use local state to manage token
  const [token, setToken] = useState(localStorage.getItem('token')); // Initialize state with token from localStorage

  // Check for token on initial load and decode user info
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setUser(null);  // If no token, clear the user state
    }
  }, [token]);  // Use token as a dependency to trigger re-render on token change

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);  // Update token state to null
    navigate('/');  // Navigate to login page
  };

  return (
    <nav className="bg-black text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold text-green-500">
          CAPTN MOVIE REVIEW APP
        </Link>
        <ul className="flex items-center space-x-6">
          {!user ? (
            <>
              <li>
                <Link
                  to="/"
                  className="hover:text-green-500 transition duration-200"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-green-500 transition duration-200"
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <span className="text-green-400">Hello, {user.name}</span>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-green-500 transition duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-green-500 transition duration-200"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
