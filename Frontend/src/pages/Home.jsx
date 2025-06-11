import { useEffect, useState } from 'react';
import '../styles/Home.css';
import { fetchPosts } from '../api/api'; 

const topics = [
  { value: 'tech', label: 'Technology' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'sports', label: 'Sports' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' }
];

function Home() {
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await fetchPosts(page, topic, searchQuery);
        
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    
    // Add debounce for search to prevent too many API calls
    const debounceTimer = setTimeout(() => {
      getPosts();
    }, searchQuery ? 500 : 0);
    
    return () => clearTimeout(debounceTimer);
  }, [topic, page, searchQuery]);

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    setPage(1); // Reset to first page when topic changes
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Latest Blog Posts</h1>
        
        <div className="search-filter-container">
          {/* Search Input */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={loading}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          {/* Topic Filter */}
          <div className="topic-filter">
            <label htmlFor="topic-select">Filter by topic:</label>
            <select
              id="topic-select"
              value={topic}
              onChange={handleTopicChange}
              disabled={loading}
            >
              <option value="">All Topics</option>
              {topics.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {totalPosts > 0 && (
          <div className="results-count">
            Showing {posts.length} of {totalPosts} posts
          </div>
        )}
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : 
    
      
      
      posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found {searchQuery ? `matching "${searchQuery}"` : ''}</p>
          <button 
            className="retry-button"
            onClick={() => {
              setSearchQuery('');
              setTopic('');
              setPage(1);
            }}
          >
            Reset filters
          </button>
        </div>
      ) : 
      
      
      (
        <main className="posts-container">
          <div className="posts-grid">
            {posts.map(post => (
              <article key={post._id} className="post-card">
                <div className="post-header">
                  <span className={`topic-badge ${post.topic}`}>
                    {topics.find(t => t.value === post.topic)?.label || post.topic}
                  </span>
                  <h2>{post.title}</h2>
                </div>
                <div className="post-content">
                  <p>{post.content.substring(0, 150)}...</p>
                </div>
                <div className="post-footer">
                  <span className="author">
                    By {post.author?.username || post.author || 'Unknown'}
                  </span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                disabled={page <= 1 || loading}
                onClick={() => setPage(p => p - 1)}
              >
                &larr; Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`page-btn ${page === pageNum ? 'active' : ''}`}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && page < totalPages - 2 && (
                  <span className="page-ellipsis">...</span>
                )}
              </div>
              
              <button 
                className="pagination-btn"
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => p + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default Home;