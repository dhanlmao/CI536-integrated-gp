import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	
	
	const handleReset = async () => {
		if (!email) return alert("Please enter your email.");
		try {
			await sendPasswordResetEmail(auth, email);
			alert("Password reset email sent!");
		} catch (error) {
			alert("Error: " + error.message);
		}
	};
	
	
	return (
		<div style={{ padding: '20px' }}>
			<h2>Reset your  password</h2>
			<input
				type="email"
				placeholder="Enter your email"
				value={email}
				onChange={e => setEmail(e.target.value)}
			/><br /><br />
			<button onClick={handleReset}>Send Reset Link</button><br /><br />
			<Link to="/login">Back to Login</Link>
		</div>
	);
};

export default ForgotPassword;
