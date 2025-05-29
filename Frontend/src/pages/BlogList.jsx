import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api/api';

const topics = ['', 'Tech', 'Health', 'Travel', 'Education', 'Sports'];

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    loadPosts(page, topic);
  }, [page, topic]);

  async function loadPosts(p, t) {
    try {
      const res = await fetchPosts(p, t);
      setPosts(res.data.posts);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  }

  return (
    <div>
      <h2>Blogs</h2>
      <select onChange={e => { setTopic(e.target.value); setPage(1); }} value={topic}>
        {topics.map(t => (
          <option key={t} value={t}>{t || 'All'}</option>
        ))}
      </select>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            <small>Topic: {post.topic}</small>
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
