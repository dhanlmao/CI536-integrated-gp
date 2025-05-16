import React, { useState } from 'react';
import { db, auth } from '../firebase/config';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

const PostListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload an image");

    if (!/^\d+(\.\d{1,2})?$/.test(price) || parseFloat(price) < 0) {
      return alert("Please enter a valid non-negative price (up to 2 decimal places, no exponent notation).");
    }

    const roundedPrice = parseFloat(price).toFixed(2);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=13ced4b9d94e13c7b52630625652263f`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");

      const imageUrl = data.data.url;

      const user = auth.currentUser;
      let userName = "Unknown";
      let userEmail = "unknown";

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          userName = userDoc.data().name || "Unknown";
        }
        userEmail = user.email || "unknown";
      }

      await addDoc(collection(db, "listings"), {
        title,
        description,
        price: roundedPrice,
        imageUrl,
        userId: user ? user.uid : "guest",
        userEmail,
        userName,
        createdAt: new Date()
      });

      alert("Listing posted!");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error("Error posting listing:", error);
      alert("Failed to post listing.");
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Post New Listing</h2>

        <label htmlFor="title" className = "sr-only">Title</label>
        <input
          id="title"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ marginBottom: '10px', width: '100%' }}
        />

        <label htmlFor="description" className="sr-only">Description</label>
        <textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ marginBottom: '10px', width: '100%' }}
        />

        <label htmlFor="price" className="sr-only">Price</label>
        <input
          id="price"
          placeholder="Price"
          type="text"
          value={price}
          onChange={e => {
            const input = e.target.value;
            const regex = /^\d*\.?\d{0,2}$/;
            if (input === '' || regex.test(input)) {
              setPrice(input);
            }
          }}
          required
          style={{ marginBottom: '10px', width: '100%' }}
        />

        <label htmlFor="image" className="sr-only">Upload Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          required
          style={{ marginBottom: '15px', width: '100%' }}
        />

        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostListing;
