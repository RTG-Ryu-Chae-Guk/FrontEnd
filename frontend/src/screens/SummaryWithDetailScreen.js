import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/SummaryWithDetailScreen.module.css';
import Header from '../components/Header';
import { FaWalking, FaHome, FaUserFriends } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const SummaryWithDetailScreen = () => {
  const [areaData, setAreaData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTrdarCd, setSelectedTrdarCd] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  const [selectedSalesItems, setSelectedSalesItems] = useState([]);
  const [selectedStoreItems, setSelectedStoreItems] = useState([]);
  const [selectedSpendingItems, setSelectedSpendingItems] = useState([]);

  const [salesInput, setSalesInput] = useState('');
  const [storeInput, setStoreInput] = useState('');
  const [spendingInput, setSpendingInput] = useState('');

  const categoryMapping = {
    '관광특구': ['강남 MICE 관광특구', '이태원 관광특구', '동대문 관광특구', '명동 관광특구', '잠실 관광특구', '종로·청계 관광특구', '홍대 관광특구'],
    '역세권': ['강남역', '건대입구역', '고속터미널역', '교대역', '신림역', '서울역', '홍대입구역(2호선)', '왕십리역', '용산역', '신촌·이대역'],
    '한강공원': ['여의도한강공원', '뚝섬한강공원', '반포한강공원', '망원한강공원', '이촌한강공원', '잠실한강공원', '양화한강공원'],
    '기타': []
  };

  useEffect(() => {
    fetch('/data/seoul_area_codes.json')
      .then(res => res.json())
      .then(data => {
        const enriched = data.map(item => {
          const match = Object.entries(categoryMapping).find(([_, areaList]) =>
            areaList.includes(item.AREA_NM)
          );
          return {
            ...item,
            category: match ? match[0] : '기타',
            areaName: item.AREA_NM
          };
        });
        setAreaData(enriched);
        setCategories([...new Set(enriched.map(d => d.category))]);
      });
  }, []);

  useEffect(() => {
    if (!selectedTrdarCd) return;
    setLoading(true);
    axios.get(`/api/commercial-areas/${selectedTrdarCd}/summary`)
      .then(res => {
        setSummaryData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, [selectedTrdarCd]);

  const parseNumber = (v) => parseInt((v ?? '').toString().replace(/,/g, '')) || 0;
  const format = (n) => {
    const parsed = parseNumber(n);
    return isNaN(parsed) ? 'N/A' : parsed.toLocaleString();
  };

  const renderIcon = (label) => {
    if (label.includes('유동')) return <FaWalking />;
    if (label.includes('상주')) return <FaHome />;
    return <FaUserFriends />;
  };

  const renderSelectAndPieChart = (label, items, selected, setSelected, inputValue, setInputValue) => {
    const handleAdd = () => {
      if (inputValue && !selected.includes(inputValue)) {
        setSelected([...selected, inputValue]);
        setInputValue('');
      }
    };

    const handleRemove = (item) => {
      setSelected(selected.filter(i => i !== item));
    };

    const chartData = items
      .filter(i => selected.includes(i.label))
      .map(i => ({ label: i.label, value: parseNumber(i.value) }));

    return (
      <div style={{ marginTop: '1rem' }}>
        <label><strong>{label} 비교 선택:</strong></label>
        <div style={{ display: 'flex', gap: '1rem', margin: '0.5rem 0' }}>
          <select onChange={(e) => setInputValue(e.target.value)} value={inputValue}>
            <option value="">-- 항목 선택 --</option>
            {items.map((i, idx) => (
              <option key={idx} value={i.label}>{i.label}</option>
            ))}
          </select>
          <button onClick={handleAdd}>추가</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {selected.map((item, idx) => (
            <button key={idx} onClick={() => handleRemove(item)} style={{ background: '#dbe4ff', border: 'none', borderRadius: '4px', padding: '0.3rem 0.6rem', cursor: 'pointer' }}>
              {item} ❌
            </button>
          ))}
        </div>
        {chartData.length > 0 && (
          <Pie
            data={{
              labels: chartData.map(i => i.label),
              datasets: [{
                data: chartData.map(i => i.value),
                backgroundColor: ['#1A4FCE', '#00C49F', '#FFBB28', '#FF8042', '#A28EF7', '#FF6666'],
              }]
            }}
          />
        )}
      </div>
    );
  };



  const renderCardStyleTable = (data) => (
    <div className={styles.cardGrid}>
      {Object.entries(data)
        .filter(([_, v]) => v !== null)
        .map(([k, v], i) => (
          <div key={i} className={styles.cardItem}>
            <div className={styles.iconWrapper}>{renderIcon(k)}</div>
            <div className={styles.label}>{k.replace(/_/g, ' ')}</div>
            <div className={styles.value}>{format(v)}명</div>
          </div>
        ))}
    </div>
  );

  const areasInCategory = areaData.filter(d => d.category === selectedCategory);

  const PieChartSection = ({ title, labels, values }) => {
    const data = {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ['#1A4FCE', '#00C49F', '#FFBB28', '#FF8042', '#A28EF7', '#FF6666'],
        borderWidth: 1,
      }]
    };

    return (
      <div style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        <h5 style={{ marginBottom: '0.5rem', color: '#1A4FCE' }}>{title}</h5>
        <Pie data={data} />
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <h2 className={styles.title}>서울 상권 통합 조회</h2>

      <div className={styles.selectPanel}>
        <div className={styles.selectGroup}>
          <label htmlFor="category">🔹 카테고리</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedTrdarCd('');
              setSummaryData(null);
            }}
          >
            <option value="">-- 선택 --</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className={styles.selectGroup}>
            <label htmlFor="region">🔸 지역</label>
            <select
              id="region"
              value={selectedTrdarCd}
              onChange={(e) => setSelectedTrdarCd(e.target.value)}
            >
              <option value="">-- 선택 --</option>
              {areasInCategory.map((area, i) => (
                <option key={i} value={area.trdarCd}>{area.areaName}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      )}


      {summaryData && (
        <div className={styles.card}>
          <div className={styles.sidebar}>
            <button onClick={() => setActiveSection('basic')}>① 기본정보</button>
            <button onClick={() => setActiveSection('floating')}>② 유동 인구</button>
            <button onClick={() => setActiveSection('sales')}>③ 매출</button>
            <button onClick={() => setActiveSection('store')}>④ 점포현황</button>
            <button onClick={() => setActiveSection('resident')}>⑤ 상주 인구</button>
            <button onClick={() => setActiveSection('spending')}>⑥ 소비 지출</button>
          </div>

          {activeSection === 'basic' && summaryData.area && (
            <section className={styles.section}>
              <h4>① 상권 기본 정보</h4>
              <ul>
                <li>동: {summaryData.area.adstrd_cd_nm}</li>
                <li>면적: {summaryData.area.relm_ar}㎡</li>
                <li>위치: 위도 {summaryData.area.latitude}, 경도 {summaryData.area.longitude}</li>
              </ul>
              <iframe title="map" src={`https://map.kakao.com/link/map/${summaryData.area.latitude},${summaryData.area.longitude}`} width="900" height="600" style={{ border: 0 }} allowFullScreen></iframe>
            </section>
          )}

          {activeSection === 'floating' && summaryData.floating_population && (
            <section className={styles.section}>
              <h4>② 유동 인구</h4>

              <h5>성별 유동 인구</h5>
              {renderCardStyleTable({
                '남성 유동인구수': summaryData.floating_population['남성_유동인구수'],
                '여성 유동인구수': summaryData.floating_population['여성_유동인구수'],
              })}
              <PieChartSection
                title="성별 유동 인구 비율"
                labels={['남성', '여성']}
                values={[
                  parseNumber(summaryData.floating_population['남성_유동인구수']),
                  parseNumber(summaryData.floating_population['여성_유동인구수']),
                ]}
              />

              <h5>연령대별 유동 인구</h5>
              {renderCardStyleTable({
                '10대 유동인구수': summaryData.floating_population['10대_유동인구수'],
                '20대 유동인구수': summaryData.floating_population['20대_유동인구수'],
                '30대 유동인구수': summaryData.floating_population['30대_유동인구수'],
                '40대 유동인구수': summaryData.floating_population['40대_유동인구수'],
                '50대 유동인구수': summaryData.floating_population['50대_유동인구수'],
              })}
              <PieChartSection
                title="연령대별 유동 인구 비율"
                labels={['10대', '20대', '30대', '40대', '50대']}
                values={[
                  parseNumber(summaryData.floating_population['10대_유동인구수']),
                  parseNumber(summaryData.floating_population['20대_유동인구수']),
                  parseNumber(summaryData.floating_population['30대_유동인구수']),
                  parseNumber(summaryData.floating_population['40대_유동인구수']),
                  parseNumber(summaryData.floating_population['50대_유동인구수']),
                ]}
              />

              <h5>시간대별 유동 인구</h5>
              {renderCardStyleTable({
                '00시~06시 유동인구수': summaryData.floating_population['00시~06시_유동인구수'],
                '06시~11시 유동인구수': summaryData.floating_population['06시~11시_유동인구수'],
                '11시~14시 유동인구수': summaryData.floating_population['11시~14시_유동인구수'],
                '14시~17시 유동인구수': summaryData.floating_population['14시~17시_유동인구수'],
                '17시~21시 유동인구수': summaryData.floating_population['17시~21시_유동인구수'],
                '21시~24시 유동인구수': summaryData.floating_population['21시~24시_유동인구수'],
              })}
              <PieChartSection
                title="시간대별 유동 인구 비율"
                labels={['00~06시', '06~11시', '11~14시', '14~17시', '17~21시', '21~24시']}
                values={[
                  parseNumber(summaryData.floating_population['00시~06시_유동인구수']),
                  parseNumber(summaryData.floating_population['06시~11시_유동인구수']),
                  parseNumber(summaryData.floating_population['11시~14시_유동인구수']),
                  parseNumber(summaryData.floating_population['14시~17시_유동인구수']),
                  parseNumber(summaryData.floating_population['17시~21시_유동인구수']),
                  parseNumber(summaryData.floating_population['21시~24시_유동인구수']),
                ]}
              />

              <h5>요일별 유동 인구</h5>
              {renderCardStyleTable({
                '월요일 유동인구수': summaryData.floating_population['월요일_유동인구수'],
                '화요일 유동인구수': summaryData.floating_population['화요일_유동인구수'],
                '수요일 유동인구수': summaryData.floating_population['수요일_유동인구수'],
                '목요일 유동인구수': summaryData.floating_population['목요일_유동인구수'],
                '금요일 유동인구수': summaryData.floating_population['금요일_유동인구수'],
                '토요일 유동인구수': summaryData.floating_population['토요일_유동인구수'],
                '일요일 유동인구수': summaryData.floating_population['일요일_유동인구수'],
              })}
              <PieChartSection
                title="요일별 유동 인구 비율"
                labels={['월', '화', '수', '목', '금', '토', '일']}
                values={[
                  parseNumber(summaryData.floating_population['월요일_유동인구수']),
                  parseNumber(summaryData.floating_population['화요일_유동인구수']),
                  parseNumber(summaryData.floating_population['수요일_유동인구수']),
                  parseNumber(summaryData.floating_population['목요일_유동인구수']),
                  parseNumber(summaryData.floating_population['금요일_유동인구수']),
                  parseNumber(summaryData.floating_population['토요일_유동인구수']),
                  parseNumber(summaryData.floating_population['일요일_유동인구수']),
                ]}
              />
            </section>
          )}


          {activeSection === 'sales' && summaryData.sales_list && (
            <section className={styles.section}>
              <h4>③ 업종별 매출</h4>

              <div className={styles.sideBySideSection}>
                {/* 표 영역 */}
                <div style={{ flex: 1 }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>업종</th>
                        <th>당월</th>
                        <th>주중</th>
                        <th>주말</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.sales_list.map((s, i) => (
                        <tr key={i}>
                          <td>{s.서비스업종_이름}</td>
                          <td>{format(s.당월_매출금액)}원</td>
                          <td>{format(s.주중_매출금액)}원</td>
                          <td>{format(s.주말_매출금액)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 파이차트 영역 */}
                <div style={{ flex: 1 }}>
                  {renderSelectAndPieChart(
                    '당월 매출 비교',
                    summaryData.sales_list.map(s => ({
                      label: s.서비스업종_이름,
                      value: s.당월_매출금액
                    })),
                    selectedSalesItems,
                    setSelectedSalesItems,
                    salesInput,
                    setSalesInput
                  )}
                </div>
              </div>
            </section>

          )}



          {activeSection === 'store' && summaryData.store_status_list && (
            <section className={styles.section}>
              <h4>④ 점포 현황</h4>

              <div className={styles.sideBySideSection}>
                {/* 표 */}
                <div style={{ flex: 1 }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>업종</th>
                        <th>점포 수</th>
                        <th>개업률</th>
                        <th>폐업률</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.store_status_list.map((s, i) => (
                        <tr key={i}>
                          <td>{s.서비스업종_이름}</td>
                          <td>{format(s.점포_수)}</td>
                          <td>{s['개업률(%)']}%</td>
                          <td>{s['폐업률(%)']}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 비교 차트 */}
                <div style={{ flex: 1 }}>
                  {renderSelectAndPieChart(
                    '점포 수 비교',
                    summaryData.store_status_list.map(s => ({
                      label: s.서비스업종_이름,
                      value: s.점포_수
                    })),
                    selectedStoreItems,
                    setSelectedStoreItems,
                    storeInput,
                    setStoreInput
                  )}
                </div>
              </div>
            </section>
          )}


          {activeSection === 'resident' && summaryData.resident_population && (
            <section className={styles.section}>
              <h4>⑤ 상주 인구</h4>

              <h5>총 상주 인구</h5>
              {renderCardStyleTable({
                '총 상주인구 수': summaryData.resident_population['총_상주인구_수'],
                '남성 상주인구 수': summaryData.resident_population['남성_상주인구_수'],
                '여성 상주인구 수': summaryData.resident_population['여성_상주인구_수'],
              })}

              <PieChartSection
                title="성별 상주 인구 비율"
                labels={['남성', '여성']}
                values={[
                  parseNumber(summaryData.resident_population['남성_상주인구_수']),
                  parseNumber(summaryData.resident_population['여성_상주인구_수']),
                ]}
              />

              <h5>연령대별 상주 인구</h5>
              {renderCardStyleTable({
                '10대 상주인구 수': summaryData.resident_population['10대_상주인구_수'],
                '20대 상주인구 수': summaryData.resident_population['20대_상주인구_수'],
                '30대 상주인구 수': summaryData.resident_population['30대_상주인구_수'],
                '40대 상주인구 수': summaryData.resident_population['40대_상주인구_수'],
                '50대 상주인구 수': summaryData.resident_population['50대_상주인구_수'],
                '60대 이상 상주인구 수': summaryData.resident_population['60대_이상_상주인구_수'],
              })}

              <PieChartSection
                title="연령대별 상주 인구 비율"
                labels={['10대', '20대', '30대', '40대', '50대', '60대 이상']}
                values={[
                  parseNumber(summaryData.resident_population['10대_상주인구_수']),
                  parseNumber(summaryData.resident_population['20대_상주인구_수']),
                  parseNumber(summaryData.resident_population['30대_상주인구_수']),
                  parseNumber(summaryData.resident_population['40대_상주인구_수']),
                  parseNumber(summaryData.resident_population['50대_상주인구_수']),
                  parseNumber(summaryData.resident_population['60대_이상_상주인구_수']),
                ]}
              />

              <h5>남성 연령대별 상주 인구</h5>
              {renderCardStyleTable({
                '남성 10대 상주인구 수': summaryData.resident_population['남성_10대_상주인구_수'],
                '남성 20대 상주인구 수': summaryData.resident_population['남성_20대_상주인구_수'],
                '남성 30대 상주인구 수': summaryData.resident_population['남성_30대_상주인구_수'],
                '남성 40대 상주인구 수': summaryData.resident_population['남성_40대_상주인구_수'],
                '남성 50대 상주인구 수': summaryData.resident_population['남성_50대_상주인구_수'],
                '남성 60대 이상 상주인구 수': summaryData.resident_population['남성_60대_이상_상주인구_수'],
              })}

              <h5>여성 연령대별 상주 인구</h5>
              {renderCardStyleTable({
                '여성 10대 상주인구 수': summaryData.resident_population['여성_10대_상주인구_수'],
                '여성 20대 상주인구 수': summaryData.resident_population['여성_20대_상주인구_수'],
                '여성 30대 상주인구 수': summaryData.resident_population['여성_30대_상주인구_수'],
                '여성 40대 상주인구 수': summaryData.resident_population['여성_40대_상주인구_수'],
                '여성 50대 상주인구 수': summaryData.resident_population['여성_50대_상주인구_수'],
                '여성 60대 이상 상주인구 수': summaryData.resident_population['여성_60대_이상_상주인구_수'],
              })}
            </section>
          )}



          {activeSection === 'spending' && summaryData.spending && (
            <section className={styles.section}>
              <h4>⑥ 소비 지출</h4>

              <div className={styles.sideBySideSection}>
                {/* 표 */}
                <div style={{ flex: 1 }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>항목</th>
                        <th>지출 금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summaryData.spending)
                        .filter(([k]) => !['상권_코드', '상권_이름', '기준_년분기_코드'].includes(k))
                        .map(([k, v], i) => (
                          <tr key={i}>
                            <td>{k.replace(/_/g, ' ')}</td>
                            <td>{format(v)}원</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 비교 차트 */}
                <div style={{ flex: 1 }}>
                  {renderSelectAndPieChart(
                    '지출 항목 비교',
                    Object.entries(summaryData.spending)
                      .filter(([k]) => !['상권_코드', '상권_이름', '기준_년분기_코드'].includes(k))
                      .map(([k, v]) => ({
                        label: k.replace(/_/g, ' '),
                        value: v
                      })),
                    selectedSpendingItems,
                    setSelectedSpendingItems,
                    spendingInput,
                    setSpendingInput
                  )}
                </div>
              </div>
            </section>
          )}



        </div>
      )}
    </div>
  );
};

export default SummaryWithDetailScreen;
