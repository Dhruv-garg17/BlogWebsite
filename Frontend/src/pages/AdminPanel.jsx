import React, { useEffect, useState, useContext } from 'react';
import { fetchPendingPosts, approvePost, rejectPost } from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadPendingPosts(page);
  }, [page, user, navigate]);

  async function loadPendingPosts(p) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPendingPosts(p);
      setPosts(res.data.posts);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error('Error fetching pending posts', err);
      setError('Failed to load pending posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id) => {
    try {
      await approvePost(id);
      loadPendingPosts(page);
    } catch (err) {
      console.error('Approve failed', err);
      setError('Failed to approve post. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPost(id);
      loadPendingPosts(page);
    } catch (err) {
      console.error('Reject failed', err);
      setError('Failed to reject post. Please try again.');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-panel">
      <header className="panel-header">
        <h1><i className="fas fa-shield-alt"></i> Admin Panel - Pending Posts</h1>
      </header>

      <main className="panel-content">
        {error && (
          <div className="error-alert">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {loading && (
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        )}

        {posts.length === 0 && !loading ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No pending posts to review</p>
          </div>
        ) : (
          <>
            <div className="posts-list">
              {posts.map(post => (
                <article key={post._id} className="post-card">
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p className="post-excerpt">{post.content.substring(0, 200)}...</p>
                    <div className="post-meta">
                      <span className="meta-topic">
                        <i className="fas fa-tag"></i> {post.topic}
                      </span>
                      <span className="meta-author">
                        <i className="fas fa-user"></i> {post.author?.username || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(post._id)}
                    >
                      <i className="fas fa-check-circle"></i> Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(post._id)}
                    >
                      <i className="fas fa-times-circle"></i> Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="pagination">
              <button 
                className="pagination-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <span className="page-indicator">
                Page {page} of {pages}
              </span>
              <button 
                className="pagination-btn"
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}