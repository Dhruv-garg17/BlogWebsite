import React, { useEffect, useState, useContext } from 'react';
import { 
  fetchPendingPosts, 
  fetchAllPosts,
  approvePost, 
  rejectPost,
  bulkApprovePosts,
  bulkRejectPosts
} from '../api/api';
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
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' or 'all'
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadPosts(page);
  }, [page, user, navigate, viewMode]);

  async function loadPosts(p) {
    setLoading(true);
    setError(null);
    try {
      const res = viewMode === 'pending' 
        ? await fetchPendingPosts(p)
        : await fetchAllPosts(p);
      setPosts(res.data.posts);
      setPage(res.data.page);
      setPages(res.data.pages);
      setSelectedPosts([]); // Clear selection when posts change
    } catch (err) {
      console.error('Error fetching posts', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id) => {
    try {
      await approvePost(id);
      loadPosts(page);
    } catch (err) {
      console.error('Approve failed', err);
      setError('Failed to approve post. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPost(id);
      loadPosts(page);
    } catch (err) {
      console.error('Reject failed', err);
      setError('Failed to reject post. Please try again.');
    }
  };

  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId) 
        : [...prev, postId]
    );
  };

  const handleBulkApprove = async () => {
    try {
      await bulkApprovePosts(selectedPosts);
      loadPosts(page);
    } catch (err) {
      console.error('Bulk approve failed', err);
      setError('Failed to approve selected posts. Please try again.');
    }
  };

  const handleBulkReject = async () => {
    try {
      await bulkRejectPosts(selectedPosts);
      loadPosts(page);
    } catch (err) {
      console.error('Bulk reject failed', err);
      setError('Failed to reject selected posts. Please try again.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post._id));
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-panel">
      <header className="panel-header">
        <h1><i className="fas fa-shield-alt"></i> Admin Panel - {viewMode === 'pending' ? 'Pending' : 'All'} Posts</h1>
        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'pending' ? 'active' : ''}`}
            onClick={() => setViewMode('pending')}
          >
            Pending
          </button>
          <button
            className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            All Posts
          </button>
        </div>
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
            <p>No {viewMode === 'pending' ? 'pending' : ''} posts to display</p>
          </div>
        ) : (
          <>
            {selectedPosts.length > 0 && (
              <div className="bulk-actions-bar">
                <span className="selected-count">
                  {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
                </span>
                <button 
                  className="bulk-approve-btn"
                  onClick={handleBulkApprove}
                >
                  <i className="fas fa-check-circle"></i> Approve Selected
                </button>
                <button 
                  className="bulk-reject-btn"
                  onClick={handleBulkReject}
                >
                  <i className="fas fa-times-circle"></i> Reject Selected
                </button>
              </div>
            )}

            <div className="posts-list">
              {posts.map(post => (
                <article key={post._id} className="post-card">
                  <div className="post-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => handleSelectPost(post._id)}
                      id={`select-${post._id}`}
                    />
                    <label htmlFor={`select-${post._id}`}></label>
                  </div>
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
                      {viewMode === 'all' && (
                        <span className={`meta-status ${post.status}`}>
                          <i className={`fas ${
                            post.status === 'approved' ? 'fa-check-circle' : 'fa-clock'
                          }`}></i> {post.status}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="post-actions">
                    {post.status !== 'approved' && (
                      <button 
                        className="approve-btn"
                        onClick={() => handleApprove(post._id)}
                      >
                        <i className="fas fa-check-circle"></i> Approve
                      </button>
                    )}
                    <button 
                      className="reject-btn"
                      onClick={() => handleReject(post._id)}
                    >
                      <i className="fas fa-times-circle"></i> {post.status === 'approved' ? 'Delete' : 'Reject'}
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