import React from 'react';
import styles from '../../css/MapScreen.module.css';

const OverlayCard = ({ region }) => (
  <div className={styles.customOverlay}>
    <div className={styles.overlayInner}>
      <h4>{region.name} 확장 상권</h4>
      <p>업종: {region.category}</p>
      <p>상업지역 비율: {region.percentage}</p>
      <p>{region.description}</p>
    </div>
    <div className={styles.overlayMenu}>
      <ul>
        <li>상권특성</li>
        <li>밀집도</li>
        <li>시장규모</li>
        <li>매출규모</li>
        <li>점포 수</li>
        <li>결제건수</li>
        <li>매출 내역</li>
      </ul>
    </div>
  </div>
);

export default OverlayCard;
