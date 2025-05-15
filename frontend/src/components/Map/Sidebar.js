// components/Map/Sidebar.js
import React from 'react';
import styles from '../../css/Sidebar.module.css';
import { IoStorefrontOutline, IoBarChartOutline, IoPlayCircleOutline, IoMedalOutline } from 'react-icons/io5';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { icon: <IoStorefrontOutline />, label: '상권분석' },
    { icon: <IoBarChartOutline />, label: '유동인구' },
    { icon: <IoMedalOutline />, label: '뜨는업종' },
    { icon: <IoPlayCircleOutline />, label: '영상컨텐츠' },
  ];

  return (
    <div className={styles.sidebar}>
      {menuItems.map((item) => (
        <div
          key={item.label}
          className={`${styles.menu} ${activeMenu === item.label ? styles.active : ''}`}
          onClick={() => setActiveMenu(item.label)}
        >
          <div className={styles.icon}>{item.icon}</div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

