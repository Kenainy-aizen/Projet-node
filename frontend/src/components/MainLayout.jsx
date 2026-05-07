import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/app/ajouter", icon: "➕", label: "Ajouter un matériel" },
  { to: "/app/liste", icon: "📋", label: "Liste & Gestion" },
  { to: "/app/bilan", icon: "📊", label: "Bilan & Graphes" },
];

const PAGE_TITLES = {
  "/app/ajouter": "Ajouter un matériel",
  "/app/liste": "Liste & Gestion",
  "/app/bilan": "Bilan & Graphes",
};

function MainLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initial = (user.username || "U")[0].toUpperCase();

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="main-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-box">🏗️</div>
          <div className="sidebar-title">
            <h2>GestMat</h2>
            <span>v1.0.0</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <span className="nav-icon-box">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initial}</div>
            <div className="user-info">
              <div className="user-name">{user.username || "Utilisateur"}</div>
              <div className="user-role">Administrateur</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Content wrapper ── */}
      <div className="content-wrapper">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <nav className="breadcrumb">
              <span className="breadcrumb-home">🏠 Accueil</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">
                {PAGE_TITLES[pathname] || "Page"}
              </span>
            </nav>
          </div>
          <div className="topbar-right">
            <span className="topbar-date">📅 {today}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
