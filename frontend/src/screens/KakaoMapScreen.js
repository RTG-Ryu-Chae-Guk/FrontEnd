import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Map/Sidebar';
import MapContainer from '../components/Map/MapContainer';
import SearchPanel from '../components/Map/SearchPanel';
import CategoryPanel from '../components/Map/CategoryPanel';
import styles from '../css/MapScreen.module.css';
import VideoPanel from '../components/Map/VideoPanel';
import RisingIndustryPanel from '../components/Map/RisingIndustryPanel';

const KakaoMapScreen = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [activeMenu, setActiveMenu] = useState('');
  const mapRef = useRef();
  const [region, setRegion] = useState(null);
  const setGlobalRegion = setRegion;

  const handleSelectRegion = ({ name }) => {
    if (mapRef.current) {
      mapRef.current.selectRegionByName(name);
    }
  };

  const handleIndustryChange = (industryName) => {
    if (mapRef.current?.handleIndustryChange) {
      mapRef.current.handleIndustryChange(industryName);
    }
  };

  return (
    <div className={styles.mapScreenWrapper}>
      <Header />
      <div className={styles.mapLayout}>
        <Sidebar activeMenu={activeMenu} setActiveMenu={(menu) => {
          setSelectedRegion(null); // 선택 영역 초기화
          setRegion(null);         // ✅ region 초기화 ← 이게 중요
          setActiveMenu(menu);
          if (menu !== '상권분석' && mapRef.current) {
            mapRef.current.clearSelection();
          }
        }} />

        {activeMenu === '상권분석' && (
          <CategoryPanel onSelectRegion={handleSelectRegion} />
        )}
        {activeMenu === '유동인구' && (
          <SearchPanel onIndustryChange={handleIndustryChange} />
        )}
        {activeMenu === '영상컨텐츠' && (
          <VideoPanel />
        )}

        <MapContainer
          ref={mapRef}
          onMarkerClick={setSelectedRegion}
          selectedRegion={selectedRegion}
          showPolygons={activeMenu === '상권분석'}
          activeMenu={activeMenu}
          setRegion={setGlobalRegion}
        />


      </div>
    </div>
  );
};

export default KakaoMapScreen;