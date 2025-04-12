import { IoSend } from "react-icons/io5";
import React from 'react';
import Header from '../components/Header';
import '../css/PcHomeScreen.css';
import phoneImg from '../assets/image/pc/home/phone.png';
import barImg from '../assets/image/pc/home/막대기그래프.png';
import pieImg from '../assets/image/pc/home/원형그래프.png';

const PcHomeScreen = () => {
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
            <input type="text" placeholder="신사동 치킨집 상권은 어디로 하면 좋을까" />
            <button className="send-btn">
              <IoSend color="#126ffe" size={24} />
            </button>
          </div>
        </div>
        <img src={phoneImg} alt="phone" className="phone-img float-animate" />
        <img src={barImg} alt="bar" className="bar-img float-animate" />
        <img src={pieImg} alt="pie" className="pie-img float-animate" />
      </div>
    </div>
  );
};

export default PcHomeScreen;
