import React, { useState, useContext } from 'react';
import { addPost } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const topics = ['Tech', 'Health', 'Travel', 'Education', 'Sports'];

export default function AddPost() {
  const [form, setForm] = useState({ title: '', content: '', topic: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await addPost(form);
      setMessage('Post submitted for approval');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error submitting post');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Post</h2>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <textarea name="content" placeholder="Content" onChange={handleChange} />
      <select name="topic" onChange={handleChange} value={form.topic}>
        <option value="">Select Topic</option>
        {topics.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <button type="submit">Submit</button>
      <p>{message}</p>
    </form>
  );
}
