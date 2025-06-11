import React, { useState, useContext } from 'react';
import { addPost } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const topics = ['Tech', 'Health', 'Travel', 'Education', 'Sports'];

export default function AddPost() {
  const [form, setForm] = useState({ 
    title: '', 
    content: '', 
    topic: '' 
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Include all required fields for the post
      await addPost({ 
        ...form,
        author: user._id,
        approved: user.role === 'admin' // Auto-approve if admin
      });
      
      setMessage(user.role === 'admin' 
        ? 'Post published successfully!' 
        : 'Post submitted for admin approval');
      
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Post submission error:', err);
      setMessage(err.response?.data?.error || 'Error submitting post');
    }
  };

  return (
    <div className="post-form-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title*</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            minLength="5"
          />
        </div>

        <div className="form-group">
          <label>Content*</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            minLength="20"
            rows={6}
          />
        </div>

        <div className="form-group">
          <label>Topic*</label>
          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            required
          >
            <option value="">Select a topic</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">
          {user.role === 'admin' ? 'Publish Post' : 'Submit for Approval'}
        </button>

        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>}
      </form>
    </div>
  );
}