import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import StartScreen from '../screens/StartScreen';
import PcHomeScreen from '../screens/PcHomeScreen';
import Map from '../screens/KakaoMapScreen';
import News from '../screens/SmallBusinessNews';
import LoginPage from '../screens/LoginPage';
import BoardPage from '../screens/BoardPage';
import PostDetail from '../screens/PostDetail';

const AppRouter = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/pchome" element={<PcHomeScreen />} />
        <Route path="/map" element={<Map />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/board" element={token ? <BoardPage /> : <Navigate to="/login" />} />
        <Route path="/post/:id" element={token ? <PostDetail /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;