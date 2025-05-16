/* global kakao */
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import styles from '../../css/MapScreen.module.css';
import PopupCard from './PopupCard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IoTrashSharp, IoLocation, IoLocationOutline } from 'react-icons/io5';
import RisingIndustryPanel from './RisingIndustryPanel';
import Hls from 'hls.js';

const MapContainer = forwardRef(({ onMarkerClick, selectedRegion, showPolygons, activeMenu, setRegion: setGlobalRegion }, ref) => {
  const mapRef = useRef(null);
  const roadviewRef = useRef(null);
  const polygonMap = useRef({});
  const centerMapByName = useRef({});
  const [region, setRegion] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [regionDataMap, setRegionDataMap] = useState({});
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoadview, setShowRoadview] = useState(false);
  const [roadviewMarkers, setRoadviewMarkers] = useState([]);
  const activeMenuRef = useRef(activeMenu);
  const [areaCodes, setAreaCodes] = useState([]);
  const [risingLoading, setRisingLoading] = useState(false);
  const [cctvMarkers, setCctvMarkers] = useState([]);
  const [cctvStreamUrl, setCctvStreamUrl] = useState('');
  const videoRef = useRef(null);
  const [realEstateData, setRealEstateData] = useState([]);
  const [realEstateMarkers, setRealEstateMarkers] = useState([]);
  const [selectedDealRegion, setSelectedDealRegion] = useState(null);
  const [sggCenters, setSggCenters] = useState([]);
  const [realEstateCircles, setRealEstateCircles] = useState([]);
  const [realEstateLabels, setRealEstateLabels] = useState([]); // ✅ 1. 상태 추가


    useEffect(() => {
      fetch('/data/seoul_area_codes.json')
        .then(res => res.json())
        .then(setAreaCodes);
    }, []);

    useEffect(() => {
      fetch('/data/seoul_sgg_centers.json')
        .then(res => res.json())
        .then(setSggCenters);
    }, []);

      useEffect(() => {
         realEstateMarkers.forEach(marker => marker.setMap(null));
         realEstateCircles.forEach(circle => circle.setMap(null));
         realEstateLabels.forEach(label => label.setMap(null));
         setRealEstateMarkers([]);
         setRealEstateCircles([]);
         setRealEstateLabels([]);
         setSelectedDealRegion(null);

         if (activeMenu !== '실거래가' || !mapInstance) return;

         fetch('/api/realestate')
           .then(res => res.json())
           .then(data => {
             setRealEstateData(data);

             const grouped = {};
             data.forEach(item => {
               if (!grouped[item.sgg_nm]) grouped[item.sgg_nm] = [];
               grouped[item.sgg_nm].push(item);
             });

             const markers = [];
             const circles = [];
             const labels = [];

             Object.entries(grouped).forEach(([sgg_nm, items]) => {
               const center = sggCenters.find(c => c.sgg_nm === sgg_nm);
               if (!center) return;

               const position = new kakao.maps.LatLng(center.lat, center.lng);

               const circle = new kakao.maps.Circle({
                 center: position,
                 radius: 2500, // 🔵 반경 더 확대
                 strokeWeight: 2,
                 strokeColor: 'red',
                 strokeOpacity: 0.9,
                 fillColor: 'red',
                 fillOpacity: 0.25
               });

               circle.setMap(mapInstance);

               // 🔵 오버레이에 구 이름 표시
               const label = new kakao.maps.CustomOverlay({
                 position: position,
                 content: `<div style="
                   padding:6px 12px;
                   color:white;
                   border-radius:8px;
                   font-size:13px;
                   font-weight:bold;
                   box-shadow: 0 0 5px rgba(0,0,0,0.3);
                 ">${sgg_nm}</div>`,
                 yAnchor: 0.5
               });
               label.setMap(mapInstance);
               labels.push(label);

               kakao.maps.event.addListener(circle, 'click', () => {
                 setSelectedDealRegion({ name: sgg_nm, deals: items });
               });

               circles.push(circle);
             });

             setRealEstateCircles(circles);
             setRealEstateLabels(labels);
           });
       }, [activeMenu, mapInstance, sggCenters]);


    useEffect(() => {
      if (!region?.streamUrl || !videoRef.current) return;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(region.streamUrl);
        hls.attachMedia(videoRef.current);
        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = region.streamUrl;
      }
    }, [region?.streamUrl]);


  useEffect(() => {
    // CCTV 마커 제거
    cctvMarkers.forEach(marker => marker.setMap(null));
    setCctvMarkers([]);

    if (activeMenu === 'CCTV' && mapInstance) {
      fetch('/api/cctvs')
        .then(res => res.json())
        .then(data => {
          const newMarkers = data.map((cctv) => {
            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(cctv.coord_y, cctv.coord_x),
              map: mapInstance,
              title: cctv.name
            });

            kakao.maps.event.addListener(marker, 'click', () => {
              // 클릭 시 .m3u8 스트리밍 오버레이 띄우기
              setRegion({
                type: 'cctv',
                name: cctv.name,
                streamUrl: cctv.url
              });
            });

            return marker;
          });

          setCctvMarkers(newMarkers);
        });
    }
  }, [activeMenu, mapInstance]);


  useImperativeHandle(ref, () => ({
    selectRegionByName(name) {
      const polygon = polygonMap.current[name];
      if (polygon) {
        kakao.maps.event.trigger(polygon, 'click');
      }
    },
    clearSelection() {
      setRegion(null);
      setSelectedRegions([]);
      setRegionDataMap({});
      Object.entries(polygonMap.current).forEach(([_, poly]) => {
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
      activeMenuRef.current = activeMenu;
    }, [activeMenu]);

  // ✅ 로드뷰 객체 연결 useEffect
  useEffect(() => {
    if (!showRoadview || !roadviewRef.current || !mapInstance) return;

    const roadview = new kakao.maps.Roadview(roadviewRef.current);
    const client = new kakao.maps.RoadviewClient();

    const handleClick = (mouseEvent) => {
      const position = mouseEvent.latLng;
      client.getNearestPanoId(position, 50, function (panoId) {
        if (panoId) {
          roadview.setPanoId(panoId, position);
        } else {
          alert('해당 위치에는 로드뷰가 없습니다.');
        }
      });
    };

    kakao.maps.event.addListener(mapInstance, 'click', handleClick);

    return () => {
      kakao.maps.event.removeListener(mapInstance, 'click', handleClick);
    };
  }, [showRoadview, roadviewRef.current, mapInstance]);

  useEffect(() => {
    if (!mapInstance) return;
    if (activeMenu !== '유동인구') return;

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

          polygon.setOptions({ fillColor, fillOpacity: 0.6 });
        });
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [mapInstance, activeMenu]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=297e5ee86b8292a80bc99ca6b2f04f5e&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const map = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(37.5665, 126.9780),
          level: 9,
        });
        setMapInstance(map);

        fetch('/data/seoul_area_boundaries_116.json')
          .then((res) => res.json())
          .then((data) => {
            Object.entries(data).forEach(([name, coords]) => {
              const latLngPath = coords.map(([lat, lng]) => new kakao.maps.LatLng(lat, lng));
              const polygon = new kakao.maps.Polygon({
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

              kakao.maps.event.addListener(polygon, 'click', () => {
                 console.log('clicked', name);
                 const currentMenu = activeMenuRef.current;
                 console.log('activeMenu:', currentMenu);
                 const codeEntry = areaCodes.find(item => item.AREA_NM === name);
                 const trdarCd = codeEntry?.trdarCd;
                if (activeMenuRef.current === '상권분석') {
                  setSelectedRegions((prev) => {
                    const alreadySelected = prev.includes(name);
                    const updated = alreadySelected ? prev.filter(n => n !== name) : [...prev, name];
                    Object.entries(polygonMap.current).forEach(([key, poly]) => {
                      poly.setOptions({
                        fillOpacity: updated.includes(key) ? 0.5 : 0.1,
                        strokeOpacity: updated.includes(key) ? 1 : 0.2,
                        strokeColor: updated.includes(key) ? '#ff3b3b' : '#cccccc',
                        strokeWeight: updated.includes(key) ? 3 : 1,
                      });
                    });
                    map.setLevel(6);
                    map.panTo(centerMapByName.current[name]);

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
                } else if (activeMenuRef.current === '뜨는업종') {
                    setRisingLoading(true); // 🔵 로딩 시작

                    fetch('/data/seoul_poi_with_trdarCd.json')
                      .then(res => res.json())
                      .then(poiData => {
                        const flatData = Object.values(poiData).flat();
                        const entry = flatData.find(item => item.AREA_NM === name);
                        const trdarCd = entry?.trdarCd;

                        if (!trdarCd) {
                          console.warn(`❗ "뜨는업종" - "${name}"에 대한 trdarCd를 찾을 수 없습니다.`);
                          setRisingLoading(false); // 🔴 실패 시 로딩 해제
                          return;
                        }

                        fetch(`/api/commercial-areas/${trdarCd}/top-store-categories?stdrYyquCd=20244`)
                          .then(res => res.json())
                          .then(data => {
                            const formattedIndustries = data.map((item, index) => ({
                              name: item.name,
                              storeCo: item.store_co,
                              closeRt: item.close_rt,
                              rate: 100 - index * 10,
                            }));

                            setRegion({
                              type: 'rising',
                              name,
                              trdarCd,
                              topIndustries: formattedIndustries,
                            });

                            setRisingLoading(false); // ✅ 성공 후 로딩 종료
                          });

                      });
                  }
                 else {
                  console.log('PopupCard 차단됨 - 메뉴가 상권분석이 아님');
                }
              });
            });
          });
      });
    };
  }, []);

  const showRoadviewMarkers = () => {
    if (!mapInstance) return;
    const bounds = mapInstance.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const latStep = (ne.getLat() - sw.getLat()) / 4;
    const lngStep = (ne.getLng() - sw.getLng()) / 4;
    const client = new kakao.maps.RoadviewClient();
    const newMarkers = [];

    for (let i = 0; i <= 4; i++) {
      for (let j = 0; j <= 4; j++) {
        const lat = sw.getLat() + latStep * i;
        const lng = sw.getLng() + lngStep * j;
        const position = new kakao.maps.LatLng(lat, lng);

        client.getNearestPanoId(position, 50, (panoId) => {
          if (panoId) {
            const marker = new kakao.maps.Marker({
              position,
              map: mapInstance,
              image: new kakao.maps.MarkerImage(
                'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png',
                new kakao.maps.Size(24, 24),
                { offset: new kakao.maps.Point(12, 12) }
              )
            });

            kakao.maps.event.addListener(marker, 'click', () => {
              if (roadviewRef.current) {
                setShowRoadview(true); // 먼저 로드뷰를 보여주고

                // setTimeout으로 DOM 렌더링 후에 roadview 객체 생성
                setTimeout(() => {
                  const roadview = new kakao.maps.Roadview(roadviewRef.current);
                  roadview.setPanoId(panoId, position);
                }, 100); // 렌더링 반영까지 약간의 딜레이
              }
            });

            newMarkers.push(marker);
            setRoadviewMarkers(prev => [...prev, marker]);
          }
        });
      }
    }
  };

  const clearRoadviewMarkers = () => {
    roadviewMarkers.forEach(marker => marker.setMap(null));
    setRoadviewMarkers([]);
  };

  const toggleRoadview = () => {
    const next = !showRoadview;
    setShowRoadview(next);
    if (next) showRoadviewMarkers();
    else clearRoadviewMarkers();
  };

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

   return (
      <div className={styles.map}>
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>유동인구 데이터를 불러오는 중입니다...</p>
          </div>
        )}
        {region && <div className={styles.overlayMask}></div>}
        <div className={styles.mapWrapper}>
          <div
            ref={mapRef}
            className={styles.map}
            style={{ width: showRoadview ? '70%' : '100%' }}
          ></div>
          {showRoadview && <div ref={roadviewRef} className={styles.roadview}></div>}
        </div>
        <div className={styles.iconButtonContainer}>
          <button onClick={() => ref.current.clearSelection()} className={styles.iconButton} title="초기화">
            <IoTrashSharp />
          </button>
          <button onClick={() => setShowRoadview(!showRoadview)} className={`${styles.iconButton} ${showRoadview ? styles.iconButtonActive : ''}`} title="로드뷰 보기/닫기">
            {showRoadview ? <IoLocation /> : <IoLocationOutline />}
          </button>
        </div>
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
        {risingLoading && activeMenu === '뜨는업종' && (
          <div className={styles.risingPanelPopup}>
            <div className={styles.risingLoader}>
              <div className={styles.spinner}></div>
            </div>
          </div>
        )}

        {region?.type === 'rising' && activeMenu === '뜨는업종' && !risingLoading && (
          <div className={styles.risingPanelPopup}>
            <RisingIndustryPanel areaName={region.name} industries={region.topIndustries} />
          </div>
        )}
        {region && region.type !== 'rising' && activeMenu === '상권분석' && (
          <PopupCard region={region} onClose={() => setRegion(null)} />
        )}

        {region?.type === 'cctv' && (
          <div className={styles.cctvOverlay}>
            <div className={styles.cctvOverlayContent}>
              <h3>{region.name}</h3>
              <video ref={videoRef} controls autoPlay muted style={{ width: '100%', borderRadius: '8px' }} />
              <button className={styles.closeBtn} onClick={() => setRegion(null)}>닫기</button>
            </div>
          </div>
        )}

        {selectedDealRegion && activeMenu === '실거래가' && (
          <div className={styles.dealOverlay}>
            <div className={styles.dealOverlayContent}>
              <h3>{selectedDealRegion.name} 실거래 목록</h3>
             <ul className={styles.dealList}>
               {selectedDealRegion.deals.map((deal, idx) => (
                 <li key={idx}>
                   <div className={styles.dealDate}>
                     📅 {deal.deal_year}.{deal.deal_month}.{deal.deal_day}
                   </div>
                   <div className={styles.dealInfo}>
                     🏢 {deal.building_use} | 💰 {deal.deal_amount}만 원
                   </div>
                   <div className={styles.dealMeta}>
                     👤 {deal.buyer_gbn} | 📍 {deal.land_use}
                   </div>
                 </li>
               ))}
             </ul>

              <button className={styles.closeBtn} onClick={() => setSelectedDealRegion(null)}>닫기</button>
            </div>
          </div>
        )}



      </div>
    );
  });

  export default MapContainer;

