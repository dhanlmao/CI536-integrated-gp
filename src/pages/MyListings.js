import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

const MyListings = () => {
  const [myListings, setMyListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', price: '', description: '' });

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, 'listings'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyListings(items);
    };

    fetchMyListings();
  }, []);

  const handleDelete = async (listingId) => {
    const confirm = window.confirm('Are you sure you want to delete this listing?');
    if (!confirm) return;

    await deleteDoc(doc(db, 'listings', listingId));
    setMyListings(prev => prev.filter(item => item.id !== listingId));
  };

  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setEditData({
      title: listing.title,
      price: listing.price,
      description: listing.description
    });
  };

  const handleSave = async (id) => {
    const parsedPrice = parseFloat(editData.price);
    if (
      isNaN(parsedPrice) ||
      parsedPrice < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(editData.price)
    ) {
      alert("Please enter a valid, non-negative price (up to 2 decimal places, no exponent notation).");
      return;
    }

    const roundedPrice = parsedPrice.toFixed(2);

    await updateDoc(doc(db, 'listings', id), {
      title: editData.title,
      price: roundedPrice,
      description: editData.description
    });

    setMyListings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...editData, price: roundedPrice } : item
      )
    );
    setEditingId(null);
  };

  return (
    <div className="grid">
      {myListings.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>You have not posted any listings yet.</p>
      ) : (
        myListings.map(listing => (
          <div className="card" key={listing.id}>
            <img src={listing.imageUrl} alt={listing.title} />
            {editingId === listing.id ? (
              <>
                <label htmlFor={`title-${listing.id}`} style={{ display: 'block' }}>Title</label>
                <input
                  id={`title-${listing.id}`}
                  value={editData.title}
                  onChange={e => setEditData({ ...editData, title: e.target.value })}
                />

                <label htmlFor={`price-${listing.id}`} style={{ display: 'block' }}>Price</label>
                <input
                  id={`price-${listing.id}`}
                  type="text"
                  value={editData.price}
                  onChange={e => {
                    const input = e.target.value;
                    const regex = /^\d*\.?\d{0,2}$/;
                    if (input === '' || regex.test(input)) {
                      setEditData({ ...editData, price: input });
                    }
                  }}
                />

                <label htmlFor={`description-${listing.id}`} style={{ display: 'block' }}>Description</label>
                <textarea
                  id={`description-${listing.id}`}
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                />

                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => handleSave(listing.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3>{listing.title}</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>£{listing.price}</p>
                <p style={{ fontSize: '13px', color: '#999' }}>{listing.description}</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => handleEdit(listing)}>Edit</button>
                  <button onClick={() => handleDelete(listing.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyListings;
						
