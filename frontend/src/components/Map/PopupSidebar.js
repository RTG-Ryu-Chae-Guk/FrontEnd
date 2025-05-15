import React from 'react';
import {
  IoGridOutline,
  IoAlbumsOutline,
  IoTrendingUpOutline,
  IoCashOutline,
  IoStorefrontOutline,
  IoCardOutline,
  IoDocumentTextOutline,
  IoSubwayOutline,
  IoBusOutline,
  IoLogoReddit,
} from 'react-icons/io5';
import styles from '../../css/PopupSidebar.module.css';

const tabMenus = [
  { label: '혼잡도', icon: <IoGridOutline /> },
  { label: '업종', icon: <IoAlbumsOutline /> },
  { label: '소비자', icon: <IoTrendingUpOutline /> },
  { label: '지하철', icon: <IoSubwayOutline /> },
  { label: '버스', icon: <IoBusOutline /> },
  { label: '결제내역', icon: <IoCardOutline /> },
  { label: '매출 정보', icon: <IoCashOutline /> },
  { label: '상주인구', icon: <IoDocumentTextOutline /> },
  { label: '점포 증감', icon: <IoStorefrontOutline /> },
  { label: '시간대별 유동인구', icon: <IoTrendingUpOutline /> },
  { label: 'AI 분석', icon: <IoLogoReddit  /> },
];

const PopupSidebar = ({ activeTab, onTabChange, onPdfDownload }) => {
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

      {/* PDF 저장 버튼 */}
        <div
          className={styles.tab}
          onClick={onPdfDownload}
        >
          <div className={styles.icon}>📄</div>
          <span>PDF 저장</span>
        </div>
    </div>
  );
};

export { tabMenus };
export default PopupSidebar;