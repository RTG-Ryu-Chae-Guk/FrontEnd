import React from 'react';
import styles from '../../css/Sidebar.module.css';
import {
  IoStorefrontOutline,
  IoBarChartOutline,
  IoPlayCircleOutline,
  IoMedalOutline,
  IoVideocamOutline,
  IoCashOutline
} from 'react-icons/io5';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const handleClick = (label) => {
    if (activeMenu === label) {
      setActiveMenu('');
    } else {
      setActiveMenu(label);
    }
  };

  const menuItems = [
    { icon: <IoStorefrontOutline />, label: '상권분석' },
    { icon: <IoBarChartOutline />, label: '유동인구' },
    { icon: <IoMedalOutline />, label: '뜨는업종' },
    { icon: <IoVideocamOutline />, label: 'CCTV' },
    { icon: <IoPlayCircleOutline />, label: '영상컨텐츠' },
    { icon: <IoCashOutline />, label: '실거래가' },
  ];

  return (
    <div className={styles.sidebar}>
      {menuItems.map((item) => (
        <div
          key={item.label}
          className={`${styles.menu} ${activeMenu === item.label ? styles.active : ''}`}
          onClick={() => handleClick(item.label)}
        >
          <div className={styles.icon}>{item.icon}</div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
