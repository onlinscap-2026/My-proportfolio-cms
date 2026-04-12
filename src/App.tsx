/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Experience from './pages/Experience';
import Education from './pages/Education';
import About from './pages/About';
import Skills from './pages/Skills';
import CV from './pages/CV';
import ResumeView from './pages/ResumeView';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsManager from './pages/dashboard/ProjectsManager';
import ExperienceManager from './pages/dashboard/ExperienceManager';
import SkillsManager from './pages/dashboard/SkillsManager';
import ResumeManager from './pages/dashboard/ResumeManager';
import EducationManager from './pages/dashboard/EducationManager';
import AboutManager from './pages/dashboard/AboutManager';
import MessagesView from './pages/dashboard/MessagesView';
import AnalyticsDashboard from './pages/dashboard/AnalyticsDashboard';
import ActivityLogs from './pages/dashboard/ActivityLogs';
import SettingsPage from './pages/dashboard/SettingsPage';

import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-theme text-theme selection:bg-orange-500/30">
            <Navbar />
            <main>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              {/* Admin Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="analytics" />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="resume" element={<ResumeManager />} />
                <Route path="education" element={<EducationManager />} />
                <Route path="about" element={<AboutManager />} />
                <Route path="messages" element={<MessagesView />} />
                <Route path="logs" element={<ActivityLogs />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}
