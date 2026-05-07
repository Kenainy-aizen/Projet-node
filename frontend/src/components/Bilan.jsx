import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getBilan } from '../services/api';

const COLORS = { Bon: '#48bb78', Mauvais: '#f56565', 'Abîmé': '#ed8936' };
const ICONS = { Bon: '✅', Mauvais: '❌', 'Abîmé': '⚠️' };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '0.9rem' }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

function Bilan() {
  const [bilan, setBilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBilan = async () => {
      try {
        const res = await getBilan();
        setBilan(res.data);
      } catch (err) {
        setError('Impossible de charger le bilan.');
      } finally {
        setLoading(false);
      }
    };
    fetchBilan();
  }, []);

  if (loading) return (
    <div>
      <div className="page-header"><h2>📊 Bilan & Graphes</h2></div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <span style={{ fontSize: '2rem' }}>⏳</span>
        <p style={{ color: '#718096', marginTop: '0.5rem' }}>Chargement du bilan...</p>
      </div>
    </div>
  );

  if (error) return (
    <div>
      <div className="page-header"><h2>📊 Bilan & Graphes</h2></div>
      <div className="message error" style={{ marginTop: 0 }}>❌ {error}</div>
    </div>
  );

  const stats = { Bon: { nb: 0, qte: 0 }, Mauvais: { nb: 0, qte: 0 }, 'Abîmé': { nb: 0, qte: 0 } };
  (bilan?.parEtat || []).forEach(item => {
    if (stats[item.etat] !== undefined) {
      stats[item.etat] = { nb: item.nb_articles, qte: item.total_quantite };
    }
  });

  const barData = Object.entries(stats).map(([etat, data]) => ({
    etat,
    'Nb Articles': parseInt(data.nb),
    'Quantité totale': parseInt(data.qte)
  }));

  const pieData = Object.entries(stats)
    .filter(([, data]) => parseInt(data.qte) > 0)
    .map(([etat, data]) => ({
      name: etat,
      value: parseInt(data.qte)
    }));

  return (
    <div>
      <div className="page-header">
        <h2>📊 Bilan & Graphes</h2>
        <p>Vue d'ensemble de l'état des matériels</p>
      </div>

      {/* Stat Cards */}
      <div className="bilan-stats">
        <div className="stat-card total">
          <span className="stat-icon">📦</span>
          <div className="stat-value">{bilan?.total || 0}</div>
          <div className="stat-label">Quantité totale</div>
        </div>
        {Object.entries(stats).map(([etat, data]) => (
          <div key={etat} className={`stat-card ${etat.toLowerCase().replace('î', 'i').replace('é', 'e')}`}>
            <span className="stat-icon">{ICONS[etat]}</span>
            <div className="stat-value">{data.nb}</div>
            <div className="stat-label">Article(s) {etat}</div>
            <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>
              Qté: {data.qte}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3>📊 Histogramme par état</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="etat" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
              <Bar dataKey="Nb Articles" fill="#2d6a9f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Quantité totale" fill="#48bb78" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h3>🥧 Répartition des quantités</h3>
          {pieData.length === 0 ? (
            <div className="no-data" style={{ height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span>📭</span>Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomPieLabel}
                  outerRadius={110}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend
                  formatter={(value) => `${ICONS[value] || ''} ${value}`}
                  wrapperStyle={{ fontSize: '0.85rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bilan;
