import React, { useState } from 'react';
import {
  IoGridOutline,
  IoAlbumsOutline,
  IoTrendingUpOutline,
  IoCashOutline,
  IoStorefrontOutline,
  IoCardOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';

import styles from '../../css/PopupSidebar.module.css';

const tabMenus = [
  { label: '상권특성', icon: <IoGridOutline /> },
  { label: '밀집도', icon: <IoAlbumsOutline /> },
  { label: '시장규모', icon: <IoTrendingUpOutline /> },
  { label: '매출규모', icon: <IoCashOutline /> },
  { label: '점포 수', icon: <IoStorefrontOutline /> },
  { label: '결제건수', icon: <IoCardOutline /> },
  { label: '매출 내역', icon: <IoDocumentTextOutline /> },
];

const PopupSidebar = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.popupSidebar}>
      {tabMenus.map((item) => (
        <div
          key={item.label}
          className={`${styles.tab} ${activeTab === item.label ? styles.active : ''}`}
          onClick={() => onTabChange(item.label)}
        >
          <div className={styles.icon}>{item.icon}</div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PopupSidebar;
