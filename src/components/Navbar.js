import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMenuOpen(false);
    navigate('/login');
  };

  if (user === undefined) return null;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-left">
        <img src="/logo.png" alt="Brighton Student Marketplace Logo" className="navbar-logo" />
        <Link to="/" className="navbar-title">Brighton Student Marketplace</Link>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-controls="navbar-links"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      <ul id="navbar-links" className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/post" onClick={() => setMenuOpen(false)}>Post Item</Link>
        </li>
        {user && (
          <li>
            <Link to="/my-listings" onClick={() => setMenuOpen(false)}>My Listings</Link>
          </li>
        )}
        {!user ? (
          <li>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          </li>
        ) : (
          <li>
            <button onClick={handleLogout} aria-label="Logout">Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
