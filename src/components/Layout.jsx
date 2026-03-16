import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PenSquare, FolderOpen, Layers, Settings } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/create', label: 'Create', icon: PenSquare },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/templates', label: 'Templates', icon: Layers },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-layout">
      <div className="app-content">
        {children}
      </div>
      <nav className="bottom-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
