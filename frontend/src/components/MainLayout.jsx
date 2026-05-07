import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">🏗️</span>
          <h2>Gestion Matériel</h2>
          <span>Tableau de bord</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/app/ajouter" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="nav-icon">➕</span>
                <span className="nav-label">Ajouter un matériel</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/app/liste" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="nav-icon">📋</span>
                <span className="nav-label">Liste & Gestion</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/app/bilan" className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="nav-icon">📊</span>
                <span className="nav-label">Bilan & Graphes</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div>
              <div className="user-name">{user.username || 'Utilisateur'}</div>
              <div className="user-role">Administrateur</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Se déconnecter
          </button>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
