import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import Header from '../components/Header';
import '../css/PcHomeScreen.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import WaveCanvas from '../components/Start/WaveCanvas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import phoneImg from '../assets/image/pc/home/phone.png';
import barImg from '../assets/image/pc/home/막대기그래프.png';
import pieImg from '../assets/image/pc/home/원형그래프.png';
import secondImg from '../assets/image/pc/home/두번째섹션.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const trdarCdList = ['3110019', '3001492', '3001493'];

const PcHomeScreen = () => {
  const secondSectionRef = useRef(null);
  const [areaData, setAreaData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topFloatingData, setTopFloatingData] = useState([]);
  const [floatingSlideIndex, setFloatingSlideIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleAsk = () => {
    if (!question.trim()) return;
    navigate(`/news?query=${encodeURIComponent(question)}`);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingSlideIndex((prev) => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.3 }
    );

    if (secondSectionRef.current) {
      observer.observe(secondSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await Promise.all(
        trdarCdList.map(async (trdarCd) => {
          const query = { params: { stdrYyquCd: '20244' } };
          const [residentsRes, spendingRes] = await Promise.all([
            axios.get(`/api/commercial-areas/${trdarCd}/residents`, query),
            axios.get(`/api/commercial-areas/${trdarCd}/spending`, query).catch(() => ({ data: {} })),
          ]);

          const format = (val) => parseInt((val || '0').toString().replace(/,/g, ''));

          const spendingData = {
            '식료품': format(spendingRes.data['식료품_지출']),
            '의류·신발': format(spendingRes.data['의류_및_신발_지출']),
            '생활용품': format(spendingRes.data['생활용품_지출']),
            '의료': format(spendingRes.data['의료비_지출']),
            '교통': format(spendingRes.data['교통_지출']),
            '여가': format(spendingRes.data['여가_지출']),
            '문화': format(spendingRes.data['문화_지출']),
            '교육': format(spendingRes.data['교육_지출']),
            '유흥': format(spendingRes.data['유흥_지출']),
          };

          const totalSpending = Object.values(spendingData).reduce((sum, v) => sum + v, 0);
          const totalPopulation = Object.values(residentsRes.data).filter((v, i) => i >= 4 && i <= 9).reduce((sum, val) => sum + parseInt(val || 0), 0);

          return {
            trdarCd,
            name: residentsRes.data['상권_이름'],
            totalPopulation: residentsRes.data['총_상주인구_수'],
            ageGroups: {
              '10대': residentsRes.data['10대_상주인구_수'],
              '20대': residentsRes.data['20대_상주인구_수'],
              '30대': residentsRes.data['30대_상주인구_수'],
              '40대': residentsRes.data['40대_상주인구_수'],
              '50대': residentsRes.data['50대_상주인구_수'],
              '60대 이상': residentsRes.data['60대_이상_상주인구_수'],
            },
            spending: spendingData,
            totalSpending,
            calcTotalPopulation: totalPopulation,
          };
        })
      );
      setAreaData(result);
    };

    const fetchTopFloating = async () => {
      try {
        const res = await axios.get('/api/commercial-areas/top-floating', {
          params: { stdrYyquCd: '20244' },
        });
        setTopFloatingData(res.data);
      } catch (err) {
        console.error('Error fetching top floating data:', err);
      }
    };

    fetchData();
    fetchTopFloating();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % areaData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [areaData]);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: true },
      y: { display: false },
    },
    elements: {
      bar: {
        borderRadius: 6,
      },
    },
  };

  const renderCharts = () => {
    if (areaData.length === 0) return <p>추천 중...</p>;

    const current = areaData[currentIndex];
    const spendingValues = Object.values(current.spending);
    const maxSpending = Math.max(...spendingValues);

    const spendingChart = {
      labels: Object.keys(current.spending),
      datasets: [
        {
          label: '지출 금액 (₩)',
          data: spendingValues,
          backgroundColor: spendingValues.map((v) =>
            v === maxSpending ? '#4c8df1' : 'rgba(76, 141, 241, 0.3)'
          ),
        },
      ],
    };

    const ageChart = {
      labels: Object.keys(current.ageGroups),
      datasets: [
        {
          label: '상주 인구 수',
          data: Object.values(current.ageGroups).map((v) => Number(v)),
          backgroundColor: Object.values(current.ageGroups).map((v) => {
            const max = Math.max(...Object.values(current.ageGroups).map((n) => Number(n)));
            return Number(v) === max ? '#fbbf24' : 'rgba(251, 191, 36, 0.3)';
          }),
        },
      ],
    };

    return (
      <div className="recommend-section card-style">
        <div className="recommend-left">
          <h3 className="recommend-name">{current.name}</h3>
          <p className="muted">총 상주 인구: {current.totalPopulation}명</p>
          <div className="chart-box">
            <Bar data={ageChart} options={chartOptions} />
          </div>
        </div>
        <div className="recommend-right">
          <h3 className="recommend-name">소비 지출 항목별 분석</h3>
          <p className="muted">총 소비 지출: ₩{current.totalSpending.toLocaleString()}</p>
          <div className="chart-box">
            <Bar data={spendingChart} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

const renderTopFloatingSection = () => {
  const labels = topFloatingData.map(item => item.area_name);
  const data = topFloatingData.map(item => item.total_floating);
  const maxValue = Math.max(...data);

  const barData = {
    labels,
    datasets: [
      {
        label: '유동인구 수',
        data,
        backgroundColor: data.map((v) =>
          v === maxValue ? '#1A4FCE' : 'rgba(26, 79, 206, 0.3)'
        ),
      },
    ],
  };

  const barOptions = {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false },
        },
        scales: {
          x: { ticks: { color: '#333' }, grid: { display: false } },
          y: {
            ticks: {
              color: '#333',
              callback: function (value) {
                return value.toLocaleString() + '명';
              },
            },
            grid: { color: 'rgba(0,0,0,0.05)' },
          },
        },
        elements: {
          bar: {
            borderRadius: 6,
          },
        },
      };

      return (
        <div className="fourth-section">
          <h2 className="fourth-title">유동인구 상위 10개 지역</h2>
          <p className="fourth-subtitle">가장 활발한 상권 TOP 10을 확인해보세요!</p>

          <div className="floating-slider">
            {floatingSlideIndex === 0 ? (
              <ul className="ranking-list slide slide-fade">
                {topFloatingData.map((item, index) => (
                  <li key={item.trdar_cd} className="ranking-item">
                    <span className="ranking-number">{index + 1}위</span>
                    <span className="ranking-name">{item.area_name}</span>
                    <span className="ranking-count">{item.total_floating.toLocaleString()}명</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="chart-box slide slide-fade" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <Bar data={barData} options={barOptions} />
              </div>
            )}
          </div>

          <div className="slider-dots">
            <div className={`dot ${floatingSlideIndex === 0 ? 'active' : ''}`}></div>
            <div className={`dot ${floatingSlideIndex === 1 ? 'active' : ''}`}></div>
          </div>
        </div>
      );
    };

  return (
    <div className="pc-home-container">
      <Header />

      <div className="pc-home-content">
        <h1 className="title">우리 동네 상권을 한눈에!</h1>
        <p className="subtitle">RCG를 통해 우리동네 상권을 한눈에 알아보세요.</p>

        <div className="search-section">
          <div className="beta-ai-container">
            <span className="beta">Beta</span>
            <span className="ai-msg">RCG AI에게 물어보세요!</span>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="신사동 치킨집 상권은 어디로 하면 좋을까"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button className="send-btn" onClick={handleAsk}>
              <IoSend color="#126ffe" size={24} />
            </button>
          </div>
        </div>

        <img src={phoneImg} alt="phone" className="phone-img float-animate" />
        <img src={barImg} alt="bar" className="bar-img float-animate" />
        <img src={pieImg} alt="pie" className="pie-img float-animate" />
      </div>

      {/* 두 번째 섹션 */}
      <div className="second-section">
        <div className="second-content fade-in" ref={secondSectionRef}>
          <div className="second-left">
            <h3>AI recommendation</h3>
            <h2>AI가 알려주는 똑똑한 상권 인사이트</h2>
            <p>
              매출, 유동인구, 소비 패턴까지<br />
              복잡한 데이터를 한눈에!<br />
              이제 상권 분석은 RCG AI에게 맡기세요.
            </p>
          </div>
          <div className="second-right">
            <img src={secondImg} alt="상권 분석" />
          </div>
        </div>
      </div>

      {/* 세 번째 섹션 */}
      <div className="third-section">
        <h2 className="third-title">상권 분석</h2>
        <p className="third-subtitle">상권 빅데이터로 상권을 추천해드립니다.</p>

        <div className="progress-bar-wrapper">
          {trdarCdList.map((_, i) => (
            <div key={i} className={`progress-dot ${i === currentIndex ? 'active' : ''}`} />
          ))}
        </div>

        {renderCharts()}
      </div>

      {/* 네 번째 섹션 */}
      {renderTopFloatingSection()}

      {/* 푸터 섹션 */}
      <footer className="footer">
        <WaveCanvas />
      </footer>
    </div>
  );
};

export default PcHomeScreen;
