import React from 'react';
import styles from '../../css/MapScreen.module.css';

const PopupInfo = ({ region, onClose }) => {
  if (!region) return null;

  return (
    <div className={styles.popup}>
      <h3>{region.name} 확장 상권</h3>
      <p>업종: {region.category}</p>
      <p>상업지역 비율: {region.percentage}</p>
      <p>{region.description}</p>
      <button className={styles['close-btn']} onClick={onClose}>닫기</button>
    </div>
  );
};

export default PopupInfo;
