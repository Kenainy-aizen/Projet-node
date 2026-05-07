import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getBilan } from "../services/api";

const PALETTE = {
  Bon: "#10b981",
  Mauvais: "#ef4444",
  Abîmé: "#f59e0b",
};

const ICONS = { Bon: "✅", Mauvais: "❌", Abîmé: "⚠️" };
const CLASSES = { Bon: "bon", Mauvais: "mauvais", Abîmé: "abime" };

/* ── Custom Bar Tooltip ── */
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "white",
        padding: "10px 14px",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-md)",
        fontSize: "0.85rem",
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: "6px", color: "var(--text)" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Custom Pie Label ── */
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ── Custom Pie Tooltip ── */
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      style={{
        background: "white",
        padding: "10px 14px",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-md)",
        fontSize: "0.85rem",
      }}
    >
      <p style={{ fontWeight: 700, color: d.payload.fill }}>
        {ICONS[d.name]} {d.name}
      </p>
      <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
        Quantité : <strong style={{ color: "var(--text)" }}>{d.value}</strong>
      </p>
    </div>
  );
};

function Bilan() {
  const [bilan, setBilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBilan()
      .then((res) => setBilan(res.data))
      .catch(() => setError("Impossible de charger le bilan."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Bilan & Graphes</h1>
          </div>
        </div>
        <div className="page-loader">
          <div className="spinner" />
          <span>Chargement du bilan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Bilan & Graphes</h1>
          </div>
        </div>
        <div className="inline-message error" style={{ marginTop: 0 }}>
          <span className="inline-message-icon">❌</span> {error}
        </div>
      </div>
    );
  }

  /* Build stats map */
  const stats = {
    Bon: { nb: 0, qte: 0 },
    Mauvais: { nb: 0, qte: 0 },
    Abîmé: { nb: 0, qte: 0 },
  };
  (bilan?.parEtat || []).forEach((row) => {
    if (stats[row.etat] !== undefined)
      stats[row.etat] = {
        nb: Number(row.nb_articles),
        qte: Number(row.total_quantite),
      };
  });

  const total = Number(bilan?.total || 0);

  const barData = Object.entries(stats).map(([etat, d]) => ({
    etat,
    Articles: d.nb,
    Quantité: d.qte,
  }));

  const pieData = Object.entries(stats)
    .filter(([, d]) => d.qte > 0)
    .map(([etat, d]) => ({ name: etat, value: d.qte }));

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Bilan & Graphes</h1>
          <p className="page-subtitle">
            Vue d'ensemble de l'état de votre inventaire
          </p>
        </div>
        <span className="page-badge">📊 Tableau de bord</span>
      </div>

      {/* Stat cards */}
      <div className="bilan-stats">
        {/* Total */}
        <div className="stat-card total">
          <div className="stat-card-header">
            <div className="stat-icon-box">📦</div>
            <span className="stat-trend">
              {Object.values(stats).reduce((a, d) => a + d.nb, 0)} articles
            </span>
          </div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Quantité totale</div>
          <div className="stat-sub">Tous états confondus</div>
        </div>

        {/* Per état */}
        {Object.entries(stats).map(([etat, d]) => (
          <div key={etat} className={`stat-card ${CLASSES[etat]}`}>
            <div className="stat-card-header">
              <div className="stat-icon-box">{ICONS[etat]}</div>
              <span className="stat-trend">{d.nb} article(s)</span>
            </div>
            <div className="stat-value">{d.qte}</div>
            <div className="stat-label">Quantité — {etat}</div>
            <div className="stat-sub">
              {total > 0
                ? `${((d.qte / total) * 100).toFixed(1)}% du total`
                : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Bar chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <span className="chart-card-title">📊 Histogramme par état</span>
            <span className="chart-tag">Articles & Quantités</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={barData}
              margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="etat"
                tick={{ fontSize: 13, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--text-light)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<BarTooltip />}
                cursor={{ fill: "var(--surface-2)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "0.8rem", paddingTop: "8px" }}
              />
              <Bar
                dataKey="Articles"
                fill="var(--primary-500)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="Quantité"
                fill="var(--success)"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <span className="chart-card-title">
              🥧 Répartition des quantités
            </span>
            <span className="chart-tag">Par état</span>
          </div>
          {pieData.length === 0 ? (
            <div className="chart-empty">
              <span>📭</span>
              <p>Aucune donnée disponible</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  labelLine={false}
                  label={PieLabel}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={PALETTE[entry.name] || "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(v) => `${ICONS[v] || ""} ${v}`}
                  wrapperStyle={{ fontSize: "0.82rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Summary table */}
      <div className="bilan-table-wrap">
        <div className="card" style={{ padding: "1.25rem" }}>
          <div
            className="card-header"
            style={{ marginBottom: "1rem", paddingBottom: "0.75rem" }}
          >
            <span className="card-title">📋 Récapitulatif détaillé</span>
          </div>
          <div className="table-container">
            <table className="bilan-summary-table">
              <thead>
                <tr>
                  <th>État</th>
                  <th>Nb. articles</th>
                  <th>Quantité totale</th>
                  <th>Part (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats).map(([etat, d]) => (
                  <tr key={etat}>
                    <td>
                      <span className={`etat-badge etat-${etat}`}>
                        <span className="etat-dot" />
                        {etat}
                      </span>
                    </td>
                    <td>{d.nb}</td>
                    <td>
                      <strong>{d.qte}</strong>
                    </td>
                    <td>
                      {total > 0 ? (
                        <span style={{ color: PALETTE[etat], fontWeight: 600 }}>
                          {((d.qte / total) * 100).toFixed(1)}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <strong>Total général</strong>
                  </td>
                  <td>
                    <strong>
                      {Object.values(stats).reduce((a, d) => a + d.nb, 0)}
                    </strong>
                  </td>
                  <td>
                    <strong>{total}</strong>
                  </td>
                  <td>
                    <strong>100%</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bilan;
