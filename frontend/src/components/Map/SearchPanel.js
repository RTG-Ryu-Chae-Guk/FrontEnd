import React from 'react';
import styles from '../../css/SearchPanel.module.css';
import { IoInformationCircleOutline } from 'react-icons/io5';

const SearchPanel = ({ onIndustryChange }) => {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.populationLegend}>
        <h4>
          <IoInformationCircleOutline className={styles.icon} /> 유동인구 색상 범례
        </h4>
        <ul>
          <li>
            <span style={{ backgroundColor: '#FF0000' }}></span>
            200만 이상
            <div className={styles.tooltip}>혼잡도가 매우 높은 지역</div>
          </li>
          <li>
            <span style={{ backgroundColor: '#FFA500' }}></span>
            150만 ~ 200만
            <div className={styles.tooltip}>혼잡도가 높은 지역</div>
          </li>
          <li>
            <span style={{ backgroundColor: '#FFFF00' }}></span>
            100만 ~ 150만
            <div className={styles.tooltip}>보통 수준의 유동인구</div>
          </li>
          <li>
            <span style={{ backgroundColor: '#00FF00' }}></span>
            50만 ~ 100만
            <div className={styles.tooltip}>유동인구가 적당한 지역</div>
          </li>
          <li>
            <span style={{ backgroundColor: '#87CEEB' }}></span>
            50만 미만
            <div className={styles.tooltip}>유동인구가 적은 지역</div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SearchPanel;