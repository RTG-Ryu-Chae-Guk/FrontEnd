import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Map/Sidebar';
import MapContainer from '../components/Map/MapContainer';
import styles from '../css/MapScreen.module.css';
import SearchPanel from '../components/Map/SearchPanel';

const KakaoMapScreen = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div className={styles.mapScreenWrapper}>
      <Header />
      <div className={styles.mapLayout}>
        <Sidebar />
        <SearchPanel />
        <MapContainer onMarkerClick={setSelectedRegion} selectedRegion={selectedRegion} />
      </div>
    </div>
  );
};

export default KakaoMapScreen;
