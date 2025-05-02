import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginPage.module.css';
import Header from '../components/Header';

const LoginPage = () => {
  const [bno, setBno] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/board');
    }
  }, [navigate]);

  const handleLogin = async () => {
    const res = await fetch('/api/status/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ b_no: [bno] }),
    });
    const data = await res.json();

    if (data.status?.match_cnt === 1 && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/board');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      alert('사업자 인증 실패: 유효하지 않은 사업자등록번호입니다.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <h1>사업자 인증</h1>
        <input
          type="text"
          value={bno}
          onChange={(e) => setBno(e.target.value)}
          placeholder="사업자등록번호 입력"
          className={`${styles.input} ${shake ? styles.shake : ''}`}
        />
        <button onClick={handleLogin} className={styles.button}>인증하기</button>
      </div>
    </div>
  );
};

export default LoginPage;