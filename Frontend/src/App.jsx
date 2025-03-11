import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CustomerLogin from "./components/CustomerLogin.jsx";
import BankerLogin from "./components/BankerLogin.jsx";
import CustomerDashboard from "./components/CustomerDashboard.jsx";
import BankerDashboard from "./components/BankerDashboard.jsx";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/customer/login" replace />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/banker/login" element={<BankerLogin />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/banker/dashboard" element={<BankerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
