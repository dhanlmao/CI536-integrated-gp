import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css'; // 👈 Add this line

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
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
        <Link to="/" className="navbar-title">Brighton Student Marketplace</Link>
      </div>

      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/post" onClick={() => setMenuOpen(false)}>Post Item</Link>
        {user && <Link to="/my-listings" onClick={() => setMenuOpen(false)}>My Listings</Link>}
        {!user ? (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
