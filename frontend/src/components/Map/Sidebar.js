import React, { useState } from 'react';
import { IoStorefrontOutline, IoWalkOutline, IoBarChartOutline, IoSparklesOutline } from 'react-icons/io5';
import styles from '../../css/Sidebar.module.css';

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState('점포수');

  const menuItems = [
    { icon: <IoStorefrontOutline />, label: '점포수' },
    { icon: <IoWalkOutline />, label: '유동인구' },
    { icon: <IoBarChartOutline />, label: '뜨는업종' },
    { icon: <IoSparklesOutline />, label: 'AI추천' },
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