// components/Map/MapContainer.js
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../../css/MapScreen.module.css';
import PopupCard from './PopupCard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MapContainer = forwardRef(({ onMarkerClick, selectedRegion, showPolygons, activeMenu }, ref) => {
  const mapRef = useRef(null);
  const polygonMap = useRef({});
  const centerMapByName = useRef({});
  const [region, setRegion] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [regionDataMap, setRegionDataMap] = useState({});
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    selectRegionByName(name) {
      const polygon = polygonMap.current[name];
      if (polygon) {
        window.kakao.maps.event.trigger(polygon, 'click');
      }
    },
    clearSelection() {
      setRegion(null);
      setSelectedRegions([]);
      setRegionDataMap({});
      Object.entries(polygonMap.current).forEach(([key, poly]) => {
        poly.setMap(mapInstance);
        poly.setOptions({
          fillColor: '#A7C7FF',
          fillOpacity: 0.3,
          strokeOpacity: 0.8,
          strokeColor: '#126ffe',
          strokeWeight: 2,
        });
      });
      if (mapInstance) mapInstance.setLevel(9);
    }
  }));

  useEffect(() => {
    Object.values(polygonMap.current).forEach(polygon => {
      polygon.setMap(mapInstance);
    });
  }, [mapInstance]);

  useEffect(() => {
    if (activeMenu !== '유동인구') {
      Object.entries(polygonMap.current).forEach(([_, polygon]) => {
        polygon.setOptions({
          fillColor: '#A7C7FF',
          fillOpacity: 0.3,
          strokeColor: '#126ffe',
          strokeWeight: 2,
          strokeOpacity: 0.8,
        });
      });
      return;
    }

    setIsLoading(true);

    fetch('/data/seoul_area_codes.json')
      .then(res => res.json())
      .then(async (codeList) => {
        const updatedData = {};
        for (const item of codeList) {
          const name = item.AREA_NM;
          const code = item.trdarCd;
          try {
            const res = await fetch(`/api/commercial-areas/${code}/floating?stdrYyquCd=20244`);
            if (!res.ok) throw new Error(`API 오류: ${code}`);
            const data = await res.json();
            updatedData[name] = parseInt(data['총_유동인구수']?.replace(/,/g, '') || '0', 10);
          } catch (e) {
            console.error(`유동인구 API 실패 - ${name} (${code}):`, e);
          }
        }

        Object.entries(polygonMap.current).forEach(([name, polygon]) => {
          const population = updatedData[name] || 0;
          let fillColor = '#ccc';
          if (population >= 2000000) fillColor = '#FF0000';
          else if (population >= 1500000) fillColor = '#FFA500';
          else if (population >= 1000000) fillColor = '#FFFF00';
          else if (population >= 500000) fillColor = '#00FF00';
          else fillColor = '#87CEEB';

          polygon.setMap(mapInstance);
          polygon.setOptions({ fillColor, fillOpacity: 0.6 });
        });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [activeMenu, mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;
    Object.entries(polygonMap.current).forEach(([name, polygon]) => {
      window.kakao.maps.event.addListener(polygon, 'click', () => {
        if (activeMenu === '상권분석') {
          setSelectedRegions((prev) => {
            const alreadySelected = prev.includes(name);
            const updated = alreadySelected ? prev.filter(n => n !== name) : [...prev, name];

            Object.entries(polygonMap.current).forEach(([key, poly]) => {
              if (updated.includes(key)) {
                poly.setOptions({
                  fillOpacity: 0.5,
                  strokeOpacity: 1,
                  strokeColor: '#ff3b3b',
                  strokeWeight: 3,
                });
              } else {
                poly.setOptions({
                  fillOpacity: 0.1,
                  strokeOpacity: 0.2,
                  strokeColor: '#cccccc',
                  strokeWeight: 1,
                });
              }
            });

            mapInstance.setLevel(6);
            mapInstance.panTo(centerMapByName.current[name]);

            if (!alreadySelected) {
              fetch(`/api/static/name/${encodeURIComponent(name)}`)
                .then((res) => res.json())
                .then((data) => {
                  setRegionDataMap(prev => ({ ...prev, [name]: { ...data, stats: data } }));
                  setRegion({ ...data, stats: data });
                });
            }

            return updated;
          });
        } else {
          fetch(`/api/static/name/${encodeURIComponent(name)}`)
            .then((res) => res.json())
            .then((data) => {
              setRegion({ ...data, stats: data });
            });
        }
      });
    });
  }, [mapInstance, activeMenu]);


  const downloadExcel = () => {
    const rows = selectedRegions.map((name) => {
      const stats = regionDataMap[name]?.stats || {};
      return {
        지역: name,
        점포수: stats.rsb_mct_cnt || '-',
        혼잡도: stats.area_congest_lvl || '-',
        남성비율: stats.male_ppltn_rate || '-',
        여성비율: stats.female_ppltn_rate || '-',
        개인소비자: stats.cmrcl_personal_rate || '-',
        법인소비자: stats.cmrcl_corporation_rate || '-',
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '상권비교');
    XLSX.writeFile(workbook, 'selected_regions.xlsx');
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('선택 지역 비교 보고서', 14, 20);
    const tableData = selectedRegions.map((name) => {
      const stats = regionDataMap[name]?.stats || {};
      return [
        name,
        stats.rsb_mct_cnt || '-',
        stats.area_congest_lvl || '-',
        `${stats.male_ppltn_rate || '-'} / ${stats.female_ppltn_rate || '-'}`,
        `${stats.cmrcl_personal_rate || '-'} / ${stats.cmrcl_corporation_rate || '-'}`
      ];
    });
    autoTable(doc, {
      head: [['지역명', '점포수', '혼잡도', '남녀비율', '소비자유형']],
      body: tableData,
      startY: 30
    });
    doc.save('selected_regions.pdf');
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=297e5ee86b8292a80bc99ca6b2f04f5e&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 9,
        });
        setMapInstance(map);

        fetch('/data/seoul_area_boundaries_116.json')
          .then((res) => res.json())
          .then((data) => {
            Object.entries(data).forEach(([name, coords]) => {
              const latLngPath = coords.map(([lat, lng]) => new window.kakao.maps.LatLng(lat, lng));
              const polygon = new window.kakao.maps.Polygon({
                path: latLngPath,
                strokeWeight: 2,
                strokeColor: '#126ffe',
                strokeOpacity: 0.8,
                fillColor: '#A7C7FF',
                fillOpacity: 0.3,
                map,
              });

              polygonMap.current[name] = polygon;
              centerMapByName.current[name] = latLngPath[0];

const customOverlay = new window.kakao.maps.CustomOverlay({
  content: `<div style="
    padding:6px 14px;
    background:#3f51b5;
    color:#fff;
    font-size:14px;
    font-weight:bold;
    border-radius:20px;
    white-space:nowrap;
    pointer-events:none;
  ">📍 ${name}</div>`,
  position: centerMapByName.current[name],
  xAnchor: 0.5,
  yAnchor: 1.5,
  zIndex: 10,
});

window.kakao.maps.event.addListener(polygon, 'mouseover', () => {
console.log('Hover:', name);
  polygon.setOptions({
    fillOpacity: 0.5,
    strokeColor: '#ff3b3b',
    strokeWeight: 3,
  });
  customOverlay.setMap(map);
});

window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
  if (!selectedRegions.includes(name)) {
    polygon.setOptions({
      fillOpacity: 0.3,
      strokeColor: '#126ffe',
      strokeWeight: 2,
    });
  }
  customOverlay.setMap(null);
});

              if (activeMenu === '상권분석') {
                window.kakao.maps.event.addListener(polygon, 'click', () => {
                  setSelectedRegions((prev) => {
                    const alreadySelected = prev.includes(name);
                    const updated = alreadySelected ? prev.filter(n => n !== name) : [...prev, name];

                    Object.entries(polygonMap.current).forEach(([key, poly]) => {
                      if (updated.includes(key)) {
                        poly.setMap(map);
                        poly.setOptions({
                          fillOpacity: 0.5,
                          strokeOpacity: 1,
                          strokeColor: '#ff3b3b',
                          strokeWeight: 3,
                        });
                      } else {
                        poly.setMap(map);
                        poly.setOptions({
                          fillOpacity: 0.1,
                          strokeOpacity: 0.2,
                          strokeColor: '#cccccc',
                          strokeWeight: 1,
                        });
                      }
                    });

                    map.setLevel(6);
                    map.panTo(latLngPath[0]);

                    if (!alreadySelected) {
                      fetch(`/api/static/name/${encodeURIComponent(name)}`)
                        .then((res) => res.json())
                        .then((data) => {
                          setRegionDataMap(prev => ({ ...prev, [name]: { ...data, stats: data } }));
                          setRegion({ ...data, stats: data });
                        });
                    }

                    return updated;
                  });
                });
              }
            });
          });
      });
    };
  }, []);

  return (
    <div className={styles.map}>

      {isLoading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>유동인구 데이터를 불러오는 중입니다...</p>
              </div>
            )}
      {region && <div className={styles.overlayMask}></div>}
      <div ref={mapRef} className={styles.map}></div>

      {selectedRegions.length > 0 && (
        <div className={styles.comparisonPanel}>
          <h4 className={styles.compareTitle}>선택 지역 비교</h4>
          <div className={styles.compareFilter}>
            <label style={{ fontWeight: 'bold' }}>카테고리:</label>
            <select onChange={(e) => setCategory(e.target.value)} value={category}>
              <option value="all">전체</option>
              <option value="rsb_mct_cnt">점포 수</option>
              <option value="area_congest_lvl">혼잡도</option>
              <option value="male_female">남녀 비율</option>
              <option value="consumer">소비자 유형</option>
            </select>
          </div>

          <ul className={styles.compareList}>
            {selectedRegions.map((name) => {
              const stat = regionDataMap[name]?.stats || {};
              if (category === 'rsb_mct_cnt') {
                return <li key={name}><strong>{name}</strong>: 점포 수 {stat.rsb_mct_cnt || '-'}</li>;
              } else if (category === 'area_congest_lvl') {
                return <li key={name}><strong>{name}</strong>: 혼잡도 {stat.area_congest_lvl || '-'}</li>;
              } else if (category === 'male_female') {
                return <li key={name}><strong>{name}</strong>: 남녀 비율 {stat.male_ppltn_rate || '-'}% / {stat.female_ppltn_rate || '-'}%</li>;
              } else if (category === 'consumer') {
                return <li key={name}><strong>{name}</strong>: 소비자 개인 {stat.cmrcl_personal_rate || '-'}% / 법인 {stat.cmrcl_corporation_rate || '-'}%</li>;
              } else {
                return <li key={name}><strong>{name}</strong>: 점포 {stat.rsb_mct_cnt || '-'}, 혼잡 {stat.area_congest_lvl || '-'}, 남녀 {stat.male_ppltn_rate || '-'}% / {stat.female_ppltn_rate || '-'}%</li>;
              }
            })}
          </ul>

          <div className={styles.compareButtons}>
            <button onClick={downloadExcel} className={`${styles.exportBtn} ${styles.exportExcel}`}>Excel 저장</button>
            <button onClick={downloadPDF} className={`${styles.exportBtn} ${styles.exportPdf}`}>PDF 저장</button>
          </div>
        </div>
      )}

      <button onClick={() => ref.current.clearSelection()} className={styles.resetButton}>초기화</button>
      {region && <PopupCard region={region} onClose={() => setRegion(null)} />}
    </div>
  );
});

export default MapContainer;
