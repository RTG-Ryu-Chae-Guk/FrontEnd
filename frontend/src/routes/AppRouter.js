import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartScreen from '../screens/StartScreen';
import PcHomeScreen from '../screens/PcHomeScreen';
import Map from '../screens/KakaoMapScreen';
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartScreen />} />
                <Route path="/pchome" element={<PcHomeScreen />} />
                <Route path="/map" element={<Map />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;