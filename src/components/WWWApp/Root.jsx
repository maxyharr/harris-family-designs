import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLoginPage from './AdminLoginPage';
import LandingPage from './LandingPage';
import AdminDashboardPage from './AdminDashboardPage';
import AppLayout from './AppLayout';

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout/>}>
          <Route index element={<LandingPage/>} />
          <Route path="about" element={<LandingPage/>} />
          <Route path="products" element={<LandingPage/>} />
          <Route path="contact" element={<LandingPage/>} />

          <Route path="admin_login" element={<AdminLoginPage/>} />
          <Route path="admin" element={<AdminDashboardPage/>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default Root;