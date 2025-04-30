import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import PopupSidebar from './PopupSidebar';
import styles from '../../css/MapScreen.module.css';

const PopupCard = ({ region, onClose }) => {
  const [activeTab, setActiveTab] = useState('상권특성');
  if (!region || !region.stats) return null;

  const stats = region.stats;

  return (
    <div className={styles.popupCard}>
      <div className={styles.popupContentWrapper}>
        <PopupSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className={styles.popupContent}>
          <div className={styles.popupHeader}>
            <h3>
              {stats.area_nm} 확장 상권 <span className={styles.category}>{region.category}</span>
            </h3>
            <IoClose className={styles.closeIcon} onClick={onClose} />
          </div>

          {activeTab === '상권특성' && (
            <div className={styles.popupSection}>
              <h4>상권 혼잡도</h4>
              <p><strong>{stats.area_congest_lvl}</strong> - {stats.area_congest_msg}</p>
              <h4>성별 비율</h4>
              <ul className={styles.statList}>
                <li>남성: {stats.male_ppltn_rate}%</li>
                <li>여성: {stats.female_ppltn_rate}%</li>
              </ul>
              <h4>거주자/비거주자</h4>
              <ul className={styles.statList}>
                <li>거주자: {stats.resnt_ppltn_rate}%</li>
                <li>비거주자: {stats.non_resnt_ppltn_rate}%</li>
              </ul>
            </div>
          )}

          {activeTab === '밀집도' && (
            <div className={styles.popupSection}>
              <h4>해당 상권 업종</h4>
              <p>대분류: {stats.rsb_lrg_ctgr} / 중분류: {stats.rsb_mid_ctgr}</p>
              <p>점포 수: {stats.rsb_mct_cnt}개</p>
              <p>기준 시점: {stats.rsb_mct_time}</p>
            </div>
          )}

          {activeTab === '시장규모' && (
            <div className={styles.popupSection}>
              <h4>연령대별 소비 비율</h4>
              <ul className={styles.statList}>
                <li>10대: {stats.cmrcl10_rate}%</li>
                <li>20대: {stats.cmrcl20_rate}%</li>
                <li>30대: {stats.cmrcl30_rate}%</li>
                <li>40대: {stats.cmrcl40_rate}%</li>
                <li>50대: {stats.cmrcl50_rate}%</li>
                <li>60대 이상: {stats.cmrcl60_rate}%</li>
              </ul>
              <h4>소비 주체</h4>
              <ul className={styles.statList}>
                <li>개인 소비자: {stats.cmrcl_personal_rate}%</li>
                <li>법인 소비자: {stats.cmrcl_corporation_rate}%</li>
              </ul>
            </div>
          )}

          {activeTab === '매출규모' && (
            <div className={styles.popupSection}>
              <h4>지하철 정보</h4>
              <p>{stats.sub_stn_nm} ({stats.sub_stn_line}호선)</p>
              <p>{stats.sub_stn_raddr} / {stats.sub_stn_jibun}</p>
              <h4>연결 역</h4>
              <ul className={styles.statList}>
                <li>이전역: {stats.sub_bf_stn}</li>
                <li>다음역: {stats.sub_nt_stn}</li>
              </ul>
            </div>
          )}

          {activeTab === '점포 수' && (
            <div className={styles.popupSection}>
              <h4>버스 정류소 정보</h4>
              <p>{stats.bus_stn_nm} (ARS ID: {stats.bus_ars_id})</p>
              <p>노선: {stats.rte_nm}</p>
              <p>혼잡도: {stats.rte_congest}</p>
            </div>
          )}

          {activeTab === '결제건수' && (
            <div className={styles.popupSection}>
              <h4>결제건수</h4>
              <p>해당 기능은 추후 업데이트 예정입니다.</p>
            </div>
          )}

          {activeTab === '매출 내역' && (
            <div className={styles.popupSection}>
              <h4>매출 내역</h4>
              <p>추후 상세 데이터를 기반으로 시각화 예정입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupCard;