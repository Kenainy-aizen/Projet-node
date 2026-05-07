import React, { useState } from 'react';
import { addMateriel } from '../services/api';

const initialForm = { design: '', etat: '', quantite: '' };

function AddMateriel() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await addMateriel(form);
      setMessage({ type: 'success', text: '✅ ' + res.data.message });
      setForm(initialForm);
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ' + (err.response?.data?.message || 'Insertion échouée') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>➕ Ajouter un matériel</h2>
        <p>Renseignez les informations du nouveau matériel</p>
      </div>

      <div className="card add-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Désignation</label>
            <input
              type="text"
              name="design"
              placeholder="Ex: Ordinateur portable Dell"
              value={form.design}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>État</label>
              <select name="etat" value={form.etat} onChange={handleChange} required>
                <option value="">-- Sélectionner --</option>
                <option value="Bon">✅ Bon</option>
                <option value="Mauvais">❌ Mauvais</option>
                <option value="Abîmé">⚠️ Abîmé</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quantité</label>
              <input
                type="number"
                name="quantite"
                placeholder="Ex: 10"
                value={form.quantite}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Enregistrement...' : '💾 Enregistrer le matériel'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddMateriel;
