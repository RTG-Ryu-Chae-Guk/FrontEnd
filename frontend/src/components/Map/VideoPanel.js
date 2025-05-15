import React from 'react';
import styles from '../../css/VideoPanel.module.css';

const VideoPanel = () => {
  const videos = [
    { id: 'bKShFnU4QWA?si=xxSZSI1FSMAAL7dg', title: '백종원의 창업 팁' },
    { id: 'NHEyQORwk3A?si=KViv1w_190Uho95X', title: '상권분석 입문' },
    { id: '_OdvuMYkibo?si=mTgGY73HMbd6e0W1', title: '상권 정보 보는 법' },
    { id: 'TIBhOHefQt8?si=BKbkwtV_N__xyE6T', title: '상권분석 꿀팁' },
    { id: 'qdDKCRYbfrI?si=NRJIj3HLjtGN8gKW', title: '상권 데이터 이해하기' },
  ];

  return (
    <div className={styles.videoPanel}>
      <h4 className={styles.header}>📹 상권분석 방법 영상</h4>
        <div className={styles.videoGrid}>
          {videos.map(video => (
            <div className={styles.videoCard} key={video.id}>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className={styles.videoTitle}>{video.title}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default VideoPanel;