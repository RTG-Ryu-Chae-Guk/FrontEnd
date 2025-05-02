import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/PostCard.module.css';

const PostCard = ({ post, onRefresh }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(true);
    await fetch(`/api/posts/${post.id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    onRefresh();
    setTimeout(() => setIsLiked(false), 500); // 애니메이션 효과 후 원상복귀
  };

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => navigate(`/post/${post.id}`)}>
        <h3 className={styles.title}>{post.title}</h3>
      </div>
      <p className={styles.content}>{post.content}</p>
      <div className={styles.meta}>
        <span className={styles.iconText}>❤️ {post.like_count}</span>
        <span className={styles.iconText}>👁️ {post.view_count}</span>
        <button
          className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          onClick={handleLike}
        >
          좋아요
        </button>
      </div>
    </div>
  );
};

export default PostCard;