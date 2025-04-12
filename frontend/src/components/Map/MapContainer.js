import React, { useEffect, useRef } from 'react';
import styles from '../../css/MapScreen.module.css';
import OverlayCard from './OverlayCard';
import PopupCard from './PopupCard';

const MapContainer = ({ onMarkerClick, selectedRegion }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=297e5ee86b8292a80bc99ca6b2f04f5e&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3,
        });

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(37.5665, 126.9780),
        });
        marker.setMap(map);

        window.kakao.maps.event.addListener(marker, 'click', () => {
          onMarkerClick({
            name: '명동',
            category: '불고기전문',
            percentage: '55.45%',
            description: '직장오피스가 26%, 주거상업 15%, 기타지역 2%',
          });
        });
      });
    };
  }, [onMarkerClick]);

  return (
    <div className={styles.map}>
      <div ref={mapRef} className={styles.map}></div>
      {selectedRegion && <PopupCard region={selectedRegion} onClose={() => onMarkerClick(null)} />}
    </div>
  );
};

export default MapContainer;