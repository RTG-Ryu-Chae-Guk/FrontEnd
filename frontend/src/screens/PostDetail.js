import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/PostDetail.module.css';
import Header from '../components/Header';

const COMMENTS_PER_PAGE = 5;

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userInfo = parseJwt(token);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [anonMap, setAnonMap] = useState({});
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [likedComments, setLikedComments] = useState({});

  const fetchPost = async () => {
    const res = await fetch(`/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPost(data);
    setEditTitle(data.title);
    setEditContent(data.content);
  };

  const fetchComments = async () => {
    const res = await fetch(`/api/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    let newMap = {};
    let count = 1;
    const sorted = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    for (const c of sorted) {
      if (!newMap[c.b_no]) newMap[c.b_no] = count++;
    }
    setAnonMap(newMap);
    setComments(sorted);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const handleDeleteComment = async (commentId) => {
    await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchComments();
  };

  const handleLikeComment = async (commentId) => {
    setLikedComments((prev) => ({ ...prev, [commentId]: true }));
    await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchComments();
    setTimeout(() => {
      setLikedComments((prev) => ({ ...prev, [commentId]: false }));
    }, 1000);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    await fetch(`/api/comments/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment, parentId: replyTo ? replyTo : null }),
    });
    setNewComment('');
    setReplyTo(null);
    fetchComments();
  };

  const handleDeletePost = async () => {
    await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/board');
  };

  const handleUpdatePost = async () => {
    await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    setEditMode(false);
    fetchPost();
  };

  const renderComments = (commentsList = [], parentId = null, depth = 0) => {
    return commentsList
      .filter((c) => c.parent_id === parentId)
      .map((comment) => (
        <div key={comment.id} className={styles.comment} style={{ marginLeft: depth * 20 }}>
          <div className={styles.commentHeader}>
            <strong>익명{anonMap[comment.b_no]}</strong>
            <span className={styles.timestamp}>{new Date(comment.created_at).toLocaleString()}</span>
            <span className={styles.likeCount + (likedComments[comment.id] ? ' ' + styles.liked : '')}>
              ❤️ {comment.like_count}
            </span>
            <button onClick={() => handleLikeComment(comment.id)}>좋아요</button>
            {userInfo?.sub === comment.b_no && (
              <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
            )}
            <button onClick={() => setReplyTo(comment.id)}>답글</button>
          </div>
          <p>{comment.content}</p>
          {replyTo === comment.id && (
            <div className={styles.replyBox}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`익명${anonMap[comment.b_no]}에게 답글 작성 중...`}
              />
              <button onClick={handleCommentSubmit}>등록</button>
            </div>
          )}
          {renderComments(commentsList, comment.id, depth + 1)}
        </div>
      ));
  };

  const totalPages = Math.ceil(
    comments.filter((c) => c.parent_id === null).length / COMMENTS_PER_PAGE
  );

  return (
    <div className={styles.detailWrapper}>
      <Header />
      <div className={styles.detailContainer}>
        {post ? (
          <>
            {editMode ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={styles.titleInput}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className={styles.contentInput}
                />
                <button onClick={handleUpdatePost}>저장</button>
                <button onClick={() => setEditMode(false)}>취소</button>
              </>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className={styles.meta}>❤️ {post.like_count} | 👁 {post.view_count}</div>
                {userInfo?.sub === post.b_no && (
                  <div className={styles.postControls}>
                    <button className={styles.editBtn} onClick={() => setEditMode(true)}>수정</button>
                    <button className={styles.deleteBtn} onClick={handleDeletePost}>삭제</button>
                  </div>
                )}
              </>
            )}
            <hr />
            <div className={styles.commentsSection}>
              <h4>댓글</h4>
              {renderComments(comments)}
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? styles.activePage : ''}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {replyTo === null && (
                <>
                  <textarea
                    className={styles.textarea}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                  />
                  <button onClick={handleCommentSubmit} className={styles.submitBtn}>
                    등록
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
