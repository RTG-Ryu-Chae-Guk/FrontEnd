import React, { useEffect, useState } from 'react';
import styles from '../css/SmallBusinessNews.module.css';
import { IoNewspaperOutline } from 'react-icons/io5';
import Header from '../components/Header';

const SmallBusinessNews = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch('/api/news/search?query=소상공인')
      .then((res) => res.json())
      .then((data) => setNewsList(data.slice(0, 10)))
      .catch((err) => console.error('뉴스 로드 실패:', err));
  }, []);

  return (
    <div className={styles.newsPageWrapper}>
      <Header />
      <div className={styles.newsPage}>
        <h2 className={styles.title}><IoNewspaperOutline /> 소상공인 관련 뉴스</h2>
        <ul className={styles.newsList}>
          {newsList.map((item, index) => (
            <li key={index} className={styles.newsItem}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.newsLink}
              >
                <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
                <p
                  className={styles.desc}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                <span className={styles.date}>{item.pub_date}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SmallBusinessNews;
