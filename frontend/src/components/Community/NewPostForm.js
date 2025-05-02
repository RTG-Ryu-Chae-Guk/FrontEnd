import React, { useState } from 'react';
import styles from '../../css/NewPostForm.module.css';

const NewPostForm = ({ onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = () => {
    fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    }).then(() => {
      setTitle('');
      setContent('');
      onPost();
    });
  };

  return (
    <div className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용을 입력하세요"
      />
      <button onClick={handleSubmit}>작성</button>
    </div>
  );
};

export default NewPostForm;
