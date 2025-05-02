import React, { useEffect, useState } from 'react';
import styles from '../../css/CommentSection.module.css';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');

  const fetchComments = () => {
    fetch(`/api/comments/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setComments);
  };

  const handleSubmit = () => {
    fetch(`/api/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parentId: 0 }),
    }).then(() => {
      setContent('');
      fetchComments();
    });
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className={styles.commentSection}>
      <h4>댓글</h4>
      <div className={styles.commentInput}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleSubmit}>등록</button>
      </div>
      <ul>
        {comments.map((c) => (
          <li key={c.id} className={styles.comment}>
            {c.content} <span>❤ {c.likeCount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
