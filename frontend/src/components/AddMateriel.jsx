import React, { useState } from "react";
import {
  Package,
  Tag,
  Hash,
  Save,
  RotateCcw,
  Eye,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { addMateriel } from "../services/api";

const initialForm = { design: "", etat: "", quantite: "" };

const ETAT_OPTIONS = [
  {
    value: "Bon",
    label: "Bon",
    icon: <CheckCircle2 size={15} />,
    color: "var(--success)",
  },
  {
    value: "Mauvais",
    label: "Mauvais",
    icon: <XCircle size={15} />,
    color: "var(--danger)",
  },
  {
    value: "Abîmé",
    label: "Abîmé",
    icon: <AlertTriangle size={15} />,
    color: "var(--warning)",
  },
];

function AddMateriel() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await addMateriel(form);
      setMessage({ type: "success", text: res.data.message });
      setForm(initialForm);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Insertion échouée",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedEtat = ETAT_OPTIONS.find((o) => o.value === form.etat);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Ajouter un matériel</h1>
          <p className="page-subtitle">
            Renseignez les informations du nouveau matériel à enregistrer
          </p>
        </div>
        <span className="page-badge">
          <Plus size={13} /> Nouveau
        </span>
      </div>

      <div className="card add-form">
        <div className="card-header">
          <span className="card-title">
            <Package size={17} /> Formulaire d'ajout
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Désignation */}
          <div className="form-group">
            <label>Désignation du matériel</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Package size={16} />
              </span>
              <input
                type="text"
                name="design"
                placeholder="Ex : Ordinateur portable Dell XPS 15"
                value={form.design}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className="form-row">
            {/* État */}
            <div className="form-group">
              <label>État</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  {selectedEtat ? (
                    <span style={{ color: selectedEtat.color }}>
                      {selectedEtat.icon}
                    </span>
                  ) : (
                    <Tag size={16} />
                  )}
                </span>
                <select
                  name="etat"
                  value={form.etat}
                  onChange={handleChange}
                  required
                >
                  <option value="">— Sélectionner —</option>
                  {ETAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantité */}
            <div className="form-group">
              <label>Quantité</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Hash size={16} />
                </span>
                <input
                  type="number"
                  name="quantite"
                  placeholder="Ex : 10"
                  value={form.quantite}
                  onChange={handleChange}
                  min="0"
                  max="99999"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-divider" />

          {/* Live preview */}
          {form.design && form.etat && form.quantite && (
            <div
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "0.85rem 1rem",
                marginBottom: "1rem",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <Eye size={14} />
              <span>Aperçu :</span>
              <strong style={{ color: "var(--text)" }}>{form.design}</strong>
              <span>·</span>
              <span className={`etat-badge etat-${form.etat}`}>
                <span className="etat-dot" />
                {form.etat}
              </span>
              <span>·</span>
              <strong style={{ color: "var(--text)" }}>
                Qté : {form.quantite}
              </strong>
            </div>
          )}

          <div className="form-footer">
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" /> Enregistrement...
                </>
              ) : (
                <>
                  <Save size={16} /> Enregistrer le matériel
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              onClick={() => {
                setForm(initialForm);
                setMessage(null);
              }}
              disabled={loading}
            >
              <RotateCcw size={14} /> Réinitialiser
            </button>
          </div>
        </form>

        {message && (
          <div className={`inline-message ${message.type}`}>
            <span className="inline-message-icon">
              {message.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <XCircle size={18} />
              )}
            </span>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddMateriel;
