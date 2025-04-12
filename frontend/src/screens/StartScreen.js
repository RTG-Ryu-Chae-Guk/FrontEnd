import React from 'react';
import WaveCanvas from '../components/Start/WaveCanvas';
import logo from '../assets/image/logo2.png'; // 또는 public 경로 사용 시 '/logo.png'
import '../css/StartScreen.css';

const StartScreen = () => {
  return (
    <div className="startscreen-container">
      <img src={logo} alt="logo" className="logo" />
      <div className="button-group">
        <button className="select-btn">📱 모바일 버전</button>
        <button className="select-btn">💻 PC 버전</button>
      </div>
      <WaveCanvas />
    </div>
  );
};

export default StartScreen;