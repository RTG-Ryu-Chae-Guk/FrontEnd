import React from 'react';
import { IoLocationSharp, IoBusiness, IoDocumentText } from 'react-icons/io5';
import styles from '../../css/SearchPanel.module.css';

const SearchPanel = () => {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.currentLocation}>
        <p className={styles.label}>현 위치</p>
        <div className={styles.locationBox}>
          <IoLocationSharp className={styles.icon} />
          <span>서울특별시 중구 장충동</span>
        </div>
      </div>

      <div className={styles.selectSection}>
        <div className={styles.selectHeader}>
          <span>분석 지역 | 업종 선택</span>
          <span className={styles.reset}>다시 선택</span>
        </div>

        <div className={styles.selectInput}>
          <IoLocationSharp className={styles.inputIcon} />
          <select>
            <option>분석 지역을 선택해 주세요</option>
          </select>
        </div>
        <div className={styles.selectInput}>
          <IoBusiness className={styles.inputIcon} />
          <select>
            <option>분석 업종을 선택해 주세요</option>
          </select>
        </div>

        <button className={styles.submitButton}>
          <IoDocumentText /> 보고서 보기
        </button>
      </div>
    </div>
  );
};

export default SearchPanel;