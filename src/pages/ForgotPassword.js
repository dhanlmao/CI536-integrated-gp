import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <label htmlFor="reset-email">Email address</label>
        <input
          id="reset-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginTop: '8px', marginBottom: '12px' }}
        />
        <button type="submit">Send Reset Link</button>
      </form>

      <div
        aria-live="polite"
        style={{ marginTop: '15px', color: message.includes("Error") ? "red" : "green" }}
      >
        {message}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
