import React, { useState, useEffect, useCallback } from 'react';
import { getAllMateriel, updateMateriel, deleteMateriel } from '../services/api';

function ListMateriel() {
  const [materiels, setMateriels] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllMateriel();
      setMateriels(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Impossible de charger les données.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const startEdit = (m) => {
    setEditId(m.n_materiel);
    setEditForm({ design: m.design, etat: m.etat, quantite: m.quantite });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const res = await updateMateriel(id, editForm);
      showMessage('success', '✅ ' + res.data.message);
      setEditId(null);
      fetchData();
    } catch (err) {
      showMessage('error', '❌ ' + (err.response?.data?.message || 'Modification échouée'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression de ce matériel ?')) return;
    try {
      const res = await deleteMateriel(id);
      showMessage('success', '✅ ' + res.data.message);
      fetchData();
    } catch (err) {
      showMessage('error', '❌ ' + (err.response?.data?.message || 'Suppression échouée'));
    }
  };

  const filtered = materiels.filter(m =>
    m.design.toLowerCase().includes(search.toLowerCase()) ||
    m.etat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h2>📋 Liste des matériels</h2>
        <p>{materiels.length} matériel(s) enregistré(s)</p>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ color: '#718096', fontSize: '0.85rem' }}>
            {filtered.length} résultat(s)
          </span>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="no-data"><span>⏳</span>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="no-data">
              <span>📭</span>
              Aucun matériel trouvé
            </div>
          ) : (
            <table className="materiel-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Désignation</th>
                  <th>État</th>
                  <th>Quantité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.n_materiel}>
                    <td><strong>{m.n_materiel}</strong></td>
                    <td>
                      {editId === m.n_materiel ? (
                        <input
                          className="edit-input"
                          value={editForm.design}
                          onChange={(e) => setEditForm({ ...editForm, design: e.target.value })}
                        />
                      ) : m.design}
                    </td>
                    <td>
                      {editId === m.n_materiel ? (
                        <select
                          className="edit-select"
                          value={editForm.etat}
                          onChange={(e) => setEditForm({ ...editForm, etat: e.target.value })}
                        >
                          <option value="Bon">Bon</option>
                          <option value="Mauvais">Mauvais</option>
                          <option value="Abîmé">Abîmé</option>
                        </select>
                      ) : (
                        <span className={`etat-badge etat-${m.etat.replace('î', 'î')}`}>
                          {m.etat === 'Bon' ? '✅' : m.etat === 'Mauvais' ? '❌' : '⚠️'} {m.etat}
                        </span>
                      )}
                    </td>
                    <td>
                      {editId === m.n_materiel ? (
                        <input
                          className="edit-input"
                          type="number"
                          min="0"
                          style={{ width: '80px' }}
                          value={editForm.quantite}
                          onChange={(e) => setEditForm({ ...editForm, quantite: e.target.value })}
                        />
                      ) : m.quantite}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {editId === m.n_materiel ? (
                          <>
                            <button className="btn-save" onClick={() => saveEdit(m.n_materiel)}>💾 Sauvegarder</button>
                            <button className="btn-cancel" onClick={cancelEdit}>✖ Annuler</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-edit" onClick={() => startEdit(m)}>✏️ Modifier</button>
                            <button className="btn-delete" onClick={() => handleDelete(m.n_materiel)}>🗑️ Supprimer</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListMateriel;
