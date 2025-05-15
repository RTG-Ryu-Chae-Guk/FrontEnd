import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import PopupSidebar, { tabMenus } from './PopupSidebar';
import styles from '../../css/PopupCard.module.css';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const getValue = (val) => (val !== null && val !== 'null' && val !== '' ? val : '미반영');

const PopupCard = ({ region, onClose }) => {
  const [activeTab, setActiveTab] = useState('혼잡도');
  const [stats, setStats] = useState(region?.stats || null);
  const [gptAnalysis, setGptAnalysis] = useState(null);

  useEffect(() => {
    if (!region || !region.stats || !region.stats.area_nm) return;
    const areaNm = region.stats.area_nm;
    fetch('/data/seoul_poi_with_trdarCd.json')
      .then((res) => res.json())
      .then((poiData) => {
        const flatData = Object.values(poiData).flat();
        const entry = flatData.find((item) => item.AREA_NM === areaNm);
        if (!entry || !entry.trdarCd) return;
        const trdarCd = entry.trdarCd;
        const fetchStats = async () => {
          try {
            const [base, residents, floating, spending, sales, stores] = await Promise.all([
              fetch(`/api/commercial-areas/${trdarCd}`).then((res) => res.json()),
              fetch(`/api/commercial-areas/${trdarCd}/residents?stdrYyquCd=20244`).then((res) => res.json()),
              fetch(`/api/commercial-areas/${trdarCd}/floating?stdrYyquCd=20244`).then((res) => res.json()),
              fetch(`/api/commercial-areas/${trdarCd}/spending?stdrYyquCd=20244`).then((res) => res.json()),
              fetch(`/api/commercial-areas/${trdarCd}/sales?stdrYyquCd=20244`).then((res) => res.json()),
              fetch(`/api/commercial-areas/${trdarCd}/stores?stdrYyquCd=20242`).then((res) => res.json()),
            ]);
            setStats((prev) => ({ ...prev, ...base, ...residents, ...floating, ...spending, sales, stores, area_nm: areaNm, category: region.category }));

            const gptRes = await axios.post(`/api/chat/analyze-commercial-area?trdarCd=${trdarCd}&stdrYyquCd=20244`);
            setGptAnalysis(gptRes.data);
          } catch (e) { console.error(e); }
        };
        fetchStats();
      });
  }, [region]);

const handlePdfDownload = () => {
  const allTabs = tabMenus.map(tab => tab.label); // 모든 탭 이름
  import('html2canvas').then(html2canvas => {
    import('jspdf').then(jsPDF => {
      const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
      let currentTabIndex = 0;

      const captureNextTab = () => {
        if (currentTabIndex >= allTabs.length) {
          pdf.save(`${stats?.area_nm || 'popup'}_report.pdf`);
          return;
        }

        const tab = allTabs[currentTabIndex];
        setActiveTab(tab); // 탭 전환

        setTimeout(() => {
          const section = document.querySelector(`.${styles.popupContent}`);
          if (!section) {
            console.warn("캡처할 섹션이 없음");
            return;
          }

          html2canvas.default(section).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            if (currentTabIndex > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            currentTabIndex++;
            captureNextTab();
          });
        }, 1000); // 👉 최소 1000ms로 설정
      };

      captureNextTab();
    });
  });
};


  const renderChart = (label, data, labels, type = 'bar', height = 200) => {
    const chartData = {
      labels,
      datasets: [{ label, data: data.map(Number), backgroundColor: '#126ffe' }]
    };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: type === 'pie' ? {} : { y: { beginAtZero: true } },
    };
    const chartStyle = { height: `${height}px`, maxHeight: `${height}px`, marginTop: '1rem' };

    return (
      <div style={chartStyle}>
        {type === 'pie'
          ? <Pie data={{ labels, datasets: [{ data: data.map(Number), backgroundColor: ['#84b6f4','#8ce0b2','#ffcc70','#ff9aa2','#cdb4db','#90e0ef'] }] }} options={chartOptions} />
          : <Bar data={chartData} options={chartOptions} />}
      </div>
    );
  };

  const renderContent = () => {


    switch (activeTab) {
      case '혼잡도':
        return <div className={styles.popupSection}>
          <h4>혼잡도</h4>
          <p><strong>{getValue(stats.area_congest_lvl)}</strong> - {getValue(stats.area_congest_msg)}</p>
          <h4>성별 비율</h4>
          <ul className={styles.statList}>
            <li>남성: {getValue(stats.male_ppltn_rate)}%</li>
            <li>여성: {getValue(stats.female_ppltn_rate)}%</li>
          </ul>
          {renderChart('성별 비율', [stats.male_ppltn_rate, stats.female_ppltn_rate], ['남성', '여성'], 'pie')}
        </div>;

      case '업종':
        return <div className={styles.popupSection}>
          <h4>상권 업종 정보</h4>
          <p>대분류: {getValue(stats.rsb_lrg_ctgr)}</p>
          <p>중분류: {getValue(stats.rsb_mid_ctgr)}</p>
          <p>점포 수: {getValue(stats.rsb_mct_cnt)}개</p>
          <p>기준 시점: {getValue(stats.rsb_mct_time)}</p>
        </div>;

      case '소비자':
        return <div className={styles.popupSection}>
          <h4>연령대별 소비</h4>
          <ul className={styles.statList}>
            <li>10대: {getValue(stats.cmrcl10_rate)}%</li>
            <li>20대: {getValue(stats.cmrcl20_rate)}%</li>
            <li>30대: {getValue(stats.cmrcl30_rate)}%</li>
            <li>40대: {getValue(stats.cmrcl40_rate)}%</li>
            <li>50대: {getValue(stats.cmrcl50_rate)}%</li>
            <li>60대 이상: {getValue(stats.cmrcl60_rate)}%</li>
          </ul>
          {renderChart('소비 비율', [stats.cmrcl10_rate, stats.cmrcl20_rate, stats.cmrcl30_rate, stats.cmrcl40_rate, stats.cmrcl50_rate, stats.cmrcl60_rate], ['10대','20대','30대','40대','50대','60대 이상'], 'pie')}
        </div>;

      case '매출 정보':
        return <div className={styles.popupSection}>
          <h4>업종별 매출</h4>
          {Array.isArray(stats.sales) && stats.sales.length > 0 && (
            <>
                          {renderChart(
                            '매출',
                            stats.sales.map(s => parseInt(s['당월_매출금액'].toString().replace(/,/g, '')) || 0),
                            stats.sales.map(s => s['서비스업종_이름'])
                          )}
              <ul className={styles.statList}>
                {stats.sales.map((item, i) => (
                  <li key={i}>{item['서비스업종_이름']}: {getValue(item['당월_매출금액'])}원</li>
                ))}
              </ul>
            </>
          )}
        </div>;
      case '시간대별 유동인구':
        return <div className={styles.popupSection}>
          <h4>시간대별 유동 인구</h4>
          <ul className={styles.statList}>
            <li>00시~06시: {getValue(stats['00시~06시_유동인구수'])}명</li>
            <li>06시~11시: {getValue(stats['06시~11시_유동인구수'])}명</li>
            <li>11시~14시: {getValue(stats['11시~14시_유동인구수'])}명</li>
            <li>14시~17시: {getValue(stats['14시~17시_유동인구수'])}명</li>
            <li>17시~21시: {getValue(stats['17시~21시_유동인구수'])}명</li>
            <li>21시~24시: {getValue(stats['21시~24시_유동인구수'])}명</li>
          </ul>
          {renderChart(
            '유동 인구',
            [
              stats['00시~06시_유동인구수'],
              stats['06시~11시_유동인구수'],
              stats['11시~14시_유동인구수'],
              stats['14시~17시_유동인구수'],
              stats['17시~21시_유동인구수'],
              stats['21시~24시_유동인구수']
            ].map(v => parseInt(v) || 0),
            ['00~06시','06~11시','11~14시','14~17시','17~21시','21~24시']
          )}
        </div>;


              case '지하철':
                return <div className={styles.popupSection}>
                  <h4>지하철 정보</h4>
                  <ul className={styles.statList}>
                    <li>역명: {getValue(stats.sub_stn_nm)}</li>
                    <li>호선: {getValue(stats.sub_stn_line)}</li>
                    <li>주소: {getValue(stats.sub_stn_raddr)} / {getValue(stats.sub_stn_jibun)}</li>
                    <li>이전역: {getValue(stats.sub_bf_stn)}</li>
                    <li>다음역: {getValue(stats.sub_nt_stn)}</li>
                  </ul>
                </div>;

              case '버스':
                return <div className={styles.popupSection}>
                  <h4>버스 정류소 정보</h4>
                  <ul className={styles.statList}>
                    <li>정류소명: {getValue(stats.bus_stn_nm)} (ARS ID: {getValue(stats.bus_ars_id)})</li>
                    <li>노선: {getValue(stats.rte_nm)}</li>
                    <li>혼잡도: {getValue(stats.rte_congest)}</li>
                  </ul>
                </div>;

              case '결제내역':
                return <div className={styles.popupSection}>
                  <h4>결제 내역</h4>
                  <ul className={styles.statList}>
                    <li>총 결제 건수: {getValue(stats.rsb_sh_payment_cnt)}</li>
                    <li>최대 결제 금액: {getValue(stats.rsb_sh_payment_amt_max)}원</li>
                    <li>최소 결제 금액: {getValue(stats.rsb_sh_payment_amt_min)}원</li>
                    <li>결제 수준: {getValue(stats.rsb_payment_lvl)}</li>
                  </ul>
                </div>;

              case '상주인구':
                return <div className={styles.popupSection}>
                  <h4>상주 인구</h4>
                  <ul className={styles.statList}>
                    <li>총 상주 인구: {getValue(stats['총_상주인구_수'])}</li>
                    <li>남성: {getValue(stats['남성_상주인구_수'])} / 여성: {getValue(stats['여성_상주인구_수'])}</li>
                  </ul>
                  <h4>연령대별 상주 인구</h4>
                  <ul className={styles.statList}>
                    <li>10대: {getValue(stats['10대_상주인구_수'])}</li>
                    <li>20대: {getValue(stats['20대_상주인구_수'])}</li>
                    <li>30대: {getValue(stats['30대_상주인구_수'])}</li>
                    <li>40대: {getValue(stats['40대_상주인구_수'])}</li>
                    <li>50대: {getValue(stats['50대_상주인구_수'])}</li>
                    <li>60대 이상: {getValue(stats['60대_이상_상주인구_수'])}</li>
                  </ul>
                  {renderChart('연령대별 상주인구', [stats['10대_상주인구_수'], stats['20대_상주인구_수'], stats['30대_상주인구_수'], stats['40대_상주인구_수'], stats['50대_상주인구_수'], stats['60대_이상_상주인구_수']], ['10대','20대','30대','40대','50대','60대 이상'])}
                </div>;

              case '점포 증감':
                return <div className={styles.popupSection}>
                  <h4>점포 증감 현황</h4>
                   {Array.isArray(stats.stores) && renderChart('점포 수', stats.stores.map(s => s['점포_수']), stats.stores.map(s => s['서비스업종_이름']))}
                  <ul className={styles.statList}>
                    {Array.isArray(stats.stores) && stats.stores.map((store, index) => (
                      <li key={index}>
                        {getValue(store['서비스업종_이름'])}: {getValue(store['점포_수'])}개, 개업률 {getValue(store['개업률(%)'])}%, 폐업률 {getValue(store['폐업률(%)'])}%
                      </li>
                    ))}
                  </ul>

                </div>;

              case 'AI 분석':
                return <div className={styles.popupSection}>
                  <h4>GPT 상권 분석</h4>
                  {gptAnalysis ? (
                    <>
                      <p><strong>분석 내용:</strong> {gptAnalysis.analysis}</p>
                      <p><strong>비 고:</strong> {gptAnalysis.recommendation}</p>
                    </>
                  ) : <p>GPT 분석을 불러오는 중입니다...</p>}
                </div>;


      default:
        return <div className={styles.popupSection}><p>선택된 탭이 없습니다.</p></div>;
    }
  };

  return (
      <div className={styles.popupCard}>
        <div className={styles.popupContentWrapper}>
          <PopupSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onPdfDownload={handlePdfDownload}
          />
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <h3>
                {getValue(stats?.area_nm)} 확장 상권 <span className={styles.category}>{getValue(stats?.category)}</span>
              </h3>

              <IoClose className={styles.closeIcon} onClick={onClose} />
            </div>
            {renderContent()}

          </div>
        </div>
      </div>
    );
  };

  export default PopupCard;
