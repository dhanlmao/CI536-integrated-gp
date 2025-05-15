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

    try {
      // Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=13ced4b9d94e13c7b52630625652263f`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("ImgBB response: ", data);

      if (!data.success) {
        throw new Error("ImgBB upload failed: " + data.error.message);
      }

      const imageUrl = data.data.url;

      // Get user info
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

      // Save listing to Firestore
      await addDoc(collection(db, "listings"), {
        title,
        description,
        price,
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
    	<form onSubmit={handleSubmit} className="card" style={{ maxwidth: '500px', width: '100%' }}>
      	<h2 style={{ textAllign: 'center' }}>Post New Listing</h2>
      	<input
        	placeholder="Title"
        	value={title}
        	onChange={e => setTitle(e.target.value)}
        	required
        	style={{ marginBottom: '10px', width: '100%' }}
      	/>
      	<textarea
        	placeholder="Description"
        	value={description}
        	onChange={e => setDescription(e.target.value)}
        	required
        	style={{ marginBottom: '10px', width: '100%' }}
      	/>
      	<input
        	placeholder="Price"
        	type="number"
        	value={price}
        	onChange={e => setPrice(e.target.value)}
        	required
        	style={{ marginBottom: '10px', width: '100%' }}
      	/>
      	<input
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
