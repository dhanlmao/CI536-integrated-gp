import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ListingModal from '../components/ListingModal';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      const snapshot = await getDocs(collection(db, 'listings'));
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(items);
    };
    fetchListings();
  }, []);

  const timeAgo = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute(s) ago`;
    if (hours < 24) return `${hours} hour(s) ago`;
    if (days < 7) return `${days} day(s) ago`;
    return date.toLocaleDateString();
  };

  const handleKeyPress = (event, listing) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedListing(listing);
    }
  };

  return (
    <main className="grid" aria-label="Listings">
      {listings.map(listing => (
        <div
          className="card"
          key={listing.id}
          onClick={() => setSelectedListing(listing)}
          onKeyDown={(e) => handleKeyPress(e, listing)}
          tabIndex="0"
          role="button"
          aria-label={`View details for ${listing.title}, priced at £${listing.price}`}
          style={{ cursor: 'pointer' }}
        >
          <img src={listing.imageUrl} alt={`Listing: ${listing.title}`} />
          <h3>{listing.title}</h3>
          <p style={{ margin: '6px 0', color: '#666', fontSize: '14px' }}>
            Posted by: <strong>{listing.userName || 'Unknown'}</strong>
          </p>
          <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>
            {timeAgo(listing.createdAt)}
          </p>
          <strong>£{listing.price}</strong>
        </div>
      ))}

      <ListingModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        timeAgo={timeAgo}
      />
    </main>
  );
};

export default Home;
