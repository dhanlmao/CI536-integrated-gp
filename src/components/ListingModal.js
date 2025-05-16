import React from 'react';

const ListingModal = ({ listing, onClose, timeAgo }) => {
  if (!listing) return null;

  return (
    <div style={overlayStyle} role="presentation" onClick={onClose}>
      <div
        style={modalStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-title"
        aria-describedby="listing-description"
        tabIndex="-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={closeStyle}
          aria-label="Close modal"
        >
          ✖
        </button>

        <img
          src={listing.imageUrl}
          alt={`Image of ${listing.title}`}
          style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
        />

        <h2 id="listing-title">{listing.title}</h2>
        <p id="listing-description">{listing.description}</p>
        <strong>£{listing.price}</strong>

        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          Posted by <strong>{listing.userName || 'Unknown'}</strong> {timeAgo(listing.createdAt)}
        </p>

        {listing.userEmail && (
          <a
            href={`mailto:${listing.userEmail}?subject=Interest in your listing "${listing.title}"`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button style={{ marginTop: '10px' }}>Contact Seller</button>
          </a>
        )}
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
  textAlign: 'center',
  position: 'relative'
};

const closeStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  color: '#000'
};

export default ListingModal;
