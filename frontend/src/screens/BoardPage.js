import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/Community/PostCard';
import NewPostForm from '../components/Community/NewPostForm';
import styles from '../css/BoardPage.module.css';
import Header from '../components/Header';

const POSTS_PER_PAGE = 5;

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const textareaRef = useRef(null);
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    const res = await fetch('/api/posts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCloseForm = () => {
    setShowForm(false);
    setContent('');
    setTitle('');
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      fetchPosts();
      handleCloseForm();
    }
  };

  const sortedPosts = [...posts].sort((a, b) => b.like_count - a.like_count);
  const hotPosts = sortedPosts.slice(0, 3);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <div className={styles.boardWithHot}>
          <div className={styles.hotSidebar}>
            <h4>🔥 HOT 게시물</h4>
            <ul className={styles.hotList}>
              {hotPosts.map((post, index) => (
                <li key={post.id} className={styles.hotItem}>
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.hotTitle}>{post.title}</span>
                  <span className={styles.hotLikes}>❤ {post.like_count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.board}>
            <div className={styles.boardHeader}>
              <h2>익명 게시판</h2>
              <button className={styles.writeButton} onClick={() => setShowForm(true)}>게시글 작성</button>
            </div>

            <div className={styles.postList}>
              {paginatedPosts.map(post => (
                <PostCard key={post.id} post={post} onRefresh={fetchPosts} />
              ))}
            </div>

            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPage === idx + 1 ? styles.activePage : ''}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupCard}>
            <button className={styles.closeBtn} onClick={handleCloseForm}>×</button>
            <div className={styles.popupHeader}>
              <h3>게시글 작성</h3>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.titleInput}
              placeholder="제목을 입력하세요"
            />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              placeholder="내용을 입력하세요..."
            />
            <button className={styles.submitBtn} onClick={handleSubmit}>등록</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
