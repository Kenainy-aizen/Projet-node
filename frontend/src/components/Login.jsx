import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/api";

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
      {/* Left — Branding */}
      <div className="login-brand">
        <div className="brand-content">
          <div className="brand-icon-wrapper">🏗️</div>
          <h1>Gestion Matériel</h1>
          <p>Gérez votre inventaire efficacement</p>
          <div className="brand-features">
            <div className="brand-feature">
              <span className="brand-feature-dot" />
              Suivi en temps réel des matériels
            </div>
            <div className="brand-feature">
              <span className="brand-feature-dot" />
              Tableaux de bord et statistiques
            </div>
            <div className="brand-feature">
              <span className="brand-feature-dot" />
              Gestion des états : Bon, Mauvais, Abîmé
            </div>
            <div className="brand-feature">
              <span className="brand-feature-dot" />
              Accès sécurisé par authentification JWT
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="login-form-panel">
        <div className="login-form-inner">
          <div className="login-form-header">
            <h2>{mode === "login" ? "Bon retour 👋" : "Créer un compte"}</h2>
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
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
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

            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
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
                  {showPassword ? "🙈" : "👁️"}
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
              ) : mode === "login" ? (
                "Se connecter →"
              ) : (
                "Créer mon compte →"
              )}
            </button>
          </form>

          {message && (
            <div className={`inline-message ${message.type}`}>
              <span className="inline-message-icon">
                {message.type === "success" ? "✅" : "❌"}
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
