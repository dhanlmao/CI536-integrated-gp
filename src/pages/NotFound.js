import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div style={{
			textAlign: 'center',
			padding: '60px 20px'
		}}>
			<h1 style={{ fontSize: '72px', marginBottom: '10px' }}>404</h1>
			<h2> Page Not Found</h2>
			<p style={{ margin: '20px 0' }}>
			Oops! the page you are looking for does not exist.
			</p>
			<Link to="/" style={{
				textDecoration: 'none',
				backgroundColor: '#007bff',
				color: '#fff',
				padding: '10px 20px',
				borderRadius: '5px'
			}}>
			Go Back Home
			</Link>
		</div>
	);
};

export default NotFound;
