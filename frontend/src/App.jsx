import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Network, UploadCloud, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import DataIngestion from './pages/DataIngestion';
import GraphExplorer from './pages/GraphExplorer';
import RiskRules from './pages/RiskRules';

function NavItem({ to, icon: Icon, label }) {
    const location = useLocation();
    const isActive = location.pathname === to || (to === '/' && location.pathname === '/dashboard');

    return (
        <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                {/* Sidebar */}
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <ShieldAlert size={24} color="#f85149" />
                        <h2>GST AI Auditor</h2>
                    </div>

                    <div className="nav-links">
                        <NavItem to="/" icon={LayoutDashboard} label="Overviews & Alerts" />
                        <NavItem to="/ingest" icon={UploadCloud} label="Data Ingestion" />
                        <NavItem to="/graph" icon={Network} label="Graph Explorer" />
                        <NavItem to="/rules" icon={() => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>} label="Risk Engine Ruleset" />
                    </div>

                    <div className="sidebar-footer">
                        <div className="user-profile">
                            <UserCircle size={32} />
                            <div>
                                <p>Admin User</p>
                                <span>ADMIN</span>
                            </div>
                        </div>
                        <button className="logout-btn">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/ingest" element={<DataIngestion />} />
                        <Route path="/graph" element={<GraphExplorer />} />
                        <Route path="/rules" element={<RiskRules />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
