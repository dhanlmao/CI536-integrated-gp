import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date()
      });

      alert('Signed up successfully!');
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Try logging in instead.');
      } else {
        console.error('Sign up error:', error.message);
        alert(error.message);
      }
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.message);
      alert(error.message);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

        {isSignup && (
          <>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <input
              id="name"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </>
        )}

        <label htmlFor="email" className="sr-only">Email</label>
        <input
          id="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginBottom: '10px', width: '100%' }}
        />

        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginBottom: '10px', width: '100%' }}
        />

        {isSignup ? (
          <button onClick={handleSignUp}>Sign Up</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}

        <p
          style={{ marginTop: '10px', cursor: 'pointer', color: 'blue' }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? 'Already have an account? Log in'
            : 'New user? Sign up here'}
        </p>

        {!isSignup && (
          <div style={{ marginTop: '10px' }}>
            <Link to="/forgot-password" style={{ color: 'blue' }}>
              Forgot Password?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
