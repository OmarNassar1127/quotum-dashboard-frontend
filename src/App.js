import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./components/auth/Login";
import DeviceManagement from "./components/auth/DeviceManagement";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Portfolio from "./components/portfolio/Portfolio";
import WalletTracking from "./components/wallet/WalletTracking";
import WalletTrackingDetail from "./components/wallet/WalletTrackingDetail";
import ProfilePage from "./components/referral/ProfilePage";
import TelegramPage from "./components/referral/TelegramPage";
import OneOnOne from "./components/oneonone/OneOnOne";
import AdminReferralPage from "./components/admin/AdminReferralPage";
import AdminLessonPage from "./components/admin/AdminLessonPage";
import CoinSuggestionManagement from "./components/admin/CoinSuggestionManagement";
import Videos from "./components/videos/Videos";
import CoinDetail from "./components/portfolio/CoinDetail";
import PostDetail from "./components/portfolio/PostDetail";
import Onchain from "./components/onchain/Onchain";
import BitcoinRiskLevels from "./components/onchain/BitcoinRiskLevels";
import BitcoinAS from "./components/onchain/BitcoinAS";
import DominanceChart from "./components/onchain/DominanceChart";
import ShortTermBubble from "./components/onchain/ShortTermBubble";
import BitcoinRainbowWave from "./components/onchain/BitcoinRainbowWave";
import NUPLIndicator from "./components/onchain/BitcoinNUPL";
import ETFVolumeChart from "./components/onchain/ETFVolumeChart";
import BitcoinSTH from "./components/onchain/BitcoinSTH";
import BitcoinLTH from "./components/onchain/BitcoinLTH";
import ETFInflow from "./components/onchain/ETFInflow";
import CoinManagement from "./components/admin/CoinManagement";
import PostManagement from "./components/admin/PostManagement";
import AdminDashboard from "./components/admin/AdminDashboard";
import WalletManagement from "./components/admin/WalletManagement";
import WalletBalanceChart from "./components/admin/WalletBalanceChart";
import SubscriptionManagement from "./components/admin/SubscriptionManagement";
import AdminLayout from "./layouts/AdminLayout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !localStorage.getItem("token") ? (
              <Login />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !localStorage.getItem("token") ? (
              <Register />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="wallet-tracking" element={<WalletTracking />} />
            <Route path="wallet-tracking/:coinId" element={<WalletTrackingDetail />} />
            <Route path="onchain" element={<Onchain />} />
            <Route path="account/devices" element={<DeviceManagement />} />
            <Route path="/onchain/bitcoin-risk-levels" element={<BitcoinRiskLevels />} />
            <Route path="/onchain/bitcoin-waves" element={<BitcoinRainbowWave />} />
            <Route path="/onchain/nupl" element={<NUPLIndicator />} />
            <Route path="/onchain/etf" element={<ETFVolumeChart />} />
            <Route path="/onchain/short-term-holders" element={<BitcoinSTH />} />
            <Route path="/onchain/long-term-holders" element={<BitcoinLTH />} />
            <Route path="/onchain/bitcoin-active-addresses" element={<BitcoinAS />} />
            <Route path="/onchain/others-vs-btc" element={<DominanceChart />} />
            <Route path="/onchain/short-term-bubble" element={<ShortTermBubble />} />
            <Route path="/onchain/etf-inflows" element={<ETFInflow />} />
            <Route path="coin/:coinId" element={<CoinDetail />} />
            <Route path="post/:postId" element={<PostDetail />} />
            <Route path="videos" element={<Videos />} />
            <Route path="help" element={<div>Help Page</div>} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="telegram" element={<TelegramPage />} />
            <Route path="one-on-one" element={<OneOnOne />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="coins" element={<CoinManagement />} />
            <Route path="posts" element={<PostManagement />} />
            <Route path="user-settings" element={<SubscriptionManagement />} />
            <Route path="wallet-trackers" element={<WalletManagement />} />
            <Route path="wallet-chart" element={<WalletBalanceChart />} />
            <Route path="referral" element={<AdminReferralPage />} />
            <Route path="lesson" element={<AdminLessonPage />} />
            <Route path="coin-suggestions" element={<CoinSuggestionManagement />} />
          </Route>
        </Route>

        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
