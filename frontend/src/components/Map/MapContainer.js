import React, { useEffect, useRef, useState } from 'react';
import styles from '../../css/MapScreen.module.css';
import PopupCard from './PopupCard';

const MapContainer = () => {
  const mapRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=297e5ee86b8292a80bc99ca6b2f04f5e&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 9,
        });

        fetch('/data/seoul_area_boundaries_116.json')
          .then((res) => res.json())
          .then((data) => {
            Object.entries(data).forEach(([name, coords]) => {
              const path = coords.map(([lat, lng]) => new window.kakao.maps.LatLng(lat, lng));

              const polygon = new window.kakao.maps.Polygon({
                path,
                strokeWeight: 2,
                strokeColor: '#126ffe',
                strokeOpacity: 0.8,
                fillColor: '#A7C7FF',
                fillOpacity: 0.3,
                map: map,
              });

              window.kakao.maps.event.addListener(polygon, 'click', () => {
                fetch(`/api/city/by-name/${encodeURIComponent(name)}`)
                  .then((res) => res.json())
                  .then((data) => {
                    setSelectedRegion({
                      name: data.area_nm,
                      category: `${data.rsb_lrg_ctgr} > ${data.rsb_mid_ctgr}`,
                      percentage: `${data.rsb_mct_cnt}개 점포`,
                      description: data.area_congest_msg,
                      stats: data,
                    });
                  })
                  .catch(() => {
                    setSelectedRegion({ name, category: '정보 없음', percentage: '-', description: '해당 지역 데이터 요청 실패' });
                  });
              });
            });
          });
      });
    };
  }, []);

  return (
    <div className={styles.map}>
      <div ref={mapRef} className={styles.map}></div>
      {selectedRegion && <PopupCard region={selectedRegion} onClose={() => setSelectedRegion(null)} />}
    </div>
  );
};

export default MapContainer;