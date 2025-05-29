import { useEffect, useState } from 'react';

const topics = ['tech', 'health', 'sports', 'education', 'entertainment'];

function Home() {
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(`/api/posts?topic=${topic}&page=${page}`);
      const data = await res.json();
      setPosts(data.posts);
      setPages(data.pages);
      setLoading(false);
    };
    fetchPosts();
  }, [topic, page]);

  return (
    <div>
      <h2>Blogs</h2>

      <label>Filter by topic: </label>
      <select
        value={topic}
        onChange={e => {
          setTopic(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All</option>
        {topics.map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {posts.map(post => (
              <li key={post._id}>
                <h3>
                  {post.title} <small>({post.topic})</small>
                </h3>
                <p>{post.content}</p>
                <small>By: {post.author}</small>
              </li>
            ))}
          </ul>

          <div>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              Prev
            </button>
            <span> Page {page} of {pages} </span>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
