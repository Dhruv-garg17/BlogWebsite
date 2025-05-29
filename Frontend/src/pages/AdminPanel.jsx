import React, { useEffect, useState, useContext } from 'react';
import { fetchPendingPosts, approvePost, rejectPost } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadPendingPosts(page);
  }, [page, user]);

  async function loadPendingPosts(p) {
    try {
      const res = await fetchPendingPosts(p);
      setPosts(res.data.posts);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error('Error fetching pending posts', err);
    }
  }

  const handleApprove = async (id) => {
    try {
      await approvePost(id);
      loadPendingPosts(page);
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPost(id);
      loadPendingPosts(page);
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  return (
    <div>
      <h2>Admin Panel - Pending Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            <small>Topic: {post.topic}</small>
            <br />
            <button onClick={() => handleApprove(post._id)}>Approve</button>
            <button onClick={() => handleReject(post._id)}>Reject</button>
          </li>
        ))}
      </ul>
      <div>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>{page} / {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
