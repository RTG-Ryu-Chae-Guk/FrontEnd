import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import PopupSidebar from './PopupSidebar';
import styles from '../../css/MapScreen.module.css';

const PopupCard = ({ region, onClose }) => {
  const [activeTab, setActiveTab] = useState('상권특성');

  if (!region) return null;

  return (
    <div className={styles.popupCard}>
      <div className={styles.popupContentWrapper}>
        {/* 왼쪽 메뉴 */}
        <PopupSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 오른쪽 본문 */}
        <div className={styles.popupContent}>
          <div className={styles.popupHeader}>
            <h3>
              {region.name} 확장 상권 <span className={styles.category}>{region.category}</span>
            </h3>
            <IoClose className={styles.closeIcon} onClick={onClose} />
          </div>

          {activeTab === '상권특성' && (
            <div className={styles.popupSection}>
              <h4>상권의 특성</h4>
              <p>{region.description}</p>
              <ul className={styles.statList}>
                <li>상업지역 비율: {region.percentage}</li>
                <li>직장오피스가: 26%</li>
                <li>주거상업: 15%</li>
                <li>기타지역: 2%</li>
              </ul>
            </div>
          )}

          {activeTab === '밀집도' && (
            <div className={styles.popupSection}>
              <h4>선택 업종 밀집도</h4>
              <p>
                해당상권 내 <span className={styles.strong}>0.1%</span>
              </p>
              <p>
                해당 상권 내 전체 업종 점포 수는 <span className={styles.strong}>9,948개</span>입니다.
              </p>
            </div>
          )}

          {activeTab === '시장규모' && (
            <div className={styles.popupSection}>
              <h4>시장규모</h4>
              <p>시장규모 정보는 추후 추가 예정입니다.</p>
            </div>
          )}

          {activeTab === '매출규모' && (
            <div className={styles.popupSection}>
              <h4>매출규모</h4>
              <p>매출규모 관련 데이터가 여기에 표시됩니다.</p>
            </div>
          )}

          {activeTab === '점포 수' && (
            <div className={styles.popupSection}>
              <h4>점포 수</h4>
              <p>해당 상권의 점포 수 정보를 확인할 수 있습니다.</p>
            </div>
          )}

          {activeTab === '결제건수' && (
            <div className={styles.popupSection}>
              <h4>결제건수</h4>
              <p>결제건수 데이터가 여기에 제공됩니다.</p>
            </div>
          )}

          {activeTab === '매출 내역' && (
            <div className={styles.popupSection}>
              <h4>매출 내역</h4>
              <p>상세 매출 내역은 추후 업데이트됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupCard;