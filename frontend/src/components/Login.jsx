import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Warehouse,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  BarChart3,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { login, register } from "../services/api";

const FEATURES = [
  { icon: <Activity size={15} />, text: "Suivi en temps réel des matériels" },
  { icon: <BarChart3 size={15} />, text: "Tableaux de bord et statistiques" },
  { icon: <Tag size={15} />, text: "Gestion des états : Bon, Mauvais, Abîmé" },
  {
    icon: <ShieldCheck size={15} />,
    text: "Accès sécurisé par authentification JWT",
  },
];

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "login") {
        const res = await login(form);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/app/ajouter");
      } else {
        await register(form);
        setMessage({
          type: "success",
          text: "Compte créé avec succès. Vous pouvez vous connecter.",
        });
        setMode("login");
        setForm({ username: "", password: "" });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Left — Branding ── */}
      <div className="login-brand">
        <div className="brand-content">
          <div className="brand-icon-wrapper">
            <Warehouse size={44} />
          </div>
          <h1>Gestion Matériel</h1>
          <p>Gérez votre inventaire efficacement</p>

          <div className="brand-features">
            {FEATURES.map((f, i) => (
              <div key={i} className="brand-feature">
                <span className="brand-feature-icon">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right — Form ── */}
      <div className="login-form-panel">
        <div className="login-form-inner">
          <div className="login-form-header">
            <h2>{mode === "login" ? "Bon retour !" : "Créer un compte"}</h2>
            <p>
              {mode === "login"
                ? "Connectez-vous pour accéder à votre tableau de bord"
                : "Renseignez vos informations pour commencer"}
            </p>
          </div>

          <div className="login-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setMessage(null);
              }}
            >
              Connexion
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => {
                setMode("register");
                setMessage(null);
              }}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="Votre nom d'utilisateur"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Votre mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                />
                <button
                  type="button"
                  className="input-suffix"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" /> Chargement...
                </>
              ) : (
                <>
                  {mode === "login" ? "Se connecter" : "Créer mon compte"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`inline-message ${message.type}`}>
              <span className="inline-message-icon">
                {message.type === "success" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
              </span>
              {message.text}
            </div>
          )}

          <p
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.8rem",
              color: "var(--text-light)",
            }}
          >
            {mode === "login" ? "Pas encore de compte ? " : "Déjà inscrit ? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setMessage(null);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-500)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
