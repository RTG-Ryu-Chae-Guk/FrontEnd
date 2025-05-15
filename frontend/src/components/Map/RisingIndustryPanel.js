import React, { useState } from 'react';
import styles from '../../css/RisingIndustryPanel.module.css';
import { IoBarChartOutline } from 'react-icons/io5';

const RisingIndustryPanel = ({ areaName, industries }) => {
  const [activeTab, setActiveTab] = useState('store');

  const sortedIndustries = [...industries].sort((a, b) => {
    if (activeTab === 'store') {
      return b.storeCo - a.storeCo;
    } else {
      return b.closeRt - a.closeRt;
    }
  });

  return (
    <div className={styles.panel}>
      <div className={styles.headerBar}>
        <IoBarChartOutline className={styles.icon} />
        <div>
          <h3>{areaName} 뜨는 업종 TOP 5</h3>
          <p>매출과 점포 수로 확인하는 지금 뜨는 업종</p>
        </div>
      </div>

      <div className={styles.sectionTabs}>
        <button
          className={`${styles.tab} ${activeTab === 'store' ? styles.active : ''}`}
          onClick={() => setActiveTab('store')}
        >
          점포 수 증가 업종
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'close' ? styles.active : ''}`}
          onClick={() => setActiveTab('close')}
        >
          폐업률 높은 업종
        </button>
      </div>

      <div className={styles.sectionCard}>
        <p className={styles.sectionTitle}>
          <strong>{areaName}</strong> {activeTab === 'store' ? '점포 수 증가업종' : '폐업률 높은 업종'} TOP 5
        </p>
        <ul className={styles.industryList}>
          {sortedIndustries.map((item, index) => (
            <li key={index} className={styles.industryItem}>
              <span className={styles.rank}>{index + 1}</span>
              <div className={styles.nameColumn}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.subInfo}>점포 수: {item.storeCo}개 · 폐업률: {item.closeRt}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RisingIndustryPanel;