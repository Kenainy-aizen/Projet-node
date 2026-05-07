import React, { useState, useEffect, useCallback } from "react";
import {
  getAllMateriel,
  updateMateriel,
  deleteMateriel,
} from "../services/api";

const FILTERS = ["Tous", "Bon", "Mauvais", "Abîmé"];

function ConfirmModal({ item, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrapper">🗑️</div>
        <h3>Confirmer la suppression</h3>
        <p>
          Voulez-vous vraiment supprimer <strong>« {item.design} »</strong> ?
          Cette action est irréversible.
        </p>
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn-modal-confirm" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function ListMateriel() {
  const [materiels, setMateriels] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllMateriel();
      setMateriels(res.data);
    } catch {
      showMessage("error", "Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
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
      showMessage("success", res.data.message);
      setEditId(null);
      fetchData();
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message || "Modification échouée",
      );
    }
  };

  const confirmDelete = (m) => setDeleteTarget(m);

  const handleDelete = async () => {
    try {
      const res = await deleteMateriel(deleteTarget.n_materiel);
      showMessage("success", res.data.message);
      fetchData();
    } catch (err) {
      showMessage(
        "error",
        err.response?.data?.message || "Suppression échouée",
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = materiels.filter((m) => {
    const matchSearch =
      m.design.toLowerCase().includes(search.toLowerCase()) ||
      m.etat.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tous" || m.etat === filter;
    return matchSearch && matchFilter;
  });

  const SkeletonRows = () => (
    <>
      {[1, 2, 3, 4].map((i) => (
        <tr key={i} className="skeleton-row">
          <td>
            <div className="skeleton-cell" style={{ width: "40px" }} />
          </td>
          <td>
            <div className="skeleton-cell" style={{ width: "180px" }} />
          </td>
          <td>
            <div className="skeleton-cell" style={{ width: "80px" }} />
          </td>
          <td>
            <div className="skeleton-cell" style={{ width: "50px" }} />
          </td>
          <td>
            <div className="skeleton-cell" style={{ width: "140px" }} />
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Liste & Gestion</h1>
          <p className="page-subtitle">
            Consultez, modifiez et supprimez les matériels enregistrés
          </p>
        </div>
        <span className="page-badge">📦 {materiels.length} matériel(s)</span>
      </div>

      <div className="card">
        <div className="table-toolbar">
          {/* Search */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filter-buttons">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? `active-${f}` : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "Tous"
                  ? "Tous"
                  : f === "Bon"
                    ? "✅ Bon"
                    : f === "Mauvais"
                      ? "❌ Mauvais"
                      : "⚠️ Abîmé"}
              </button>
            ))}
          </div>

          <span className="table-meta">{filtered.length} résultat(s)</span>
        </div>

        <div className="table-container">
          <table className="materiel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Désignation</th>
                <th>État</th>
                <th>Quantité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <span className="empty-state-icon">📭</span>
                      <h3>Aucun matériel trouvé</h3>
                      <p>
                        {search || filter !== "Tous"
                          ? "Essayez de modifier vos filtres de recherche"
                          : "Commencez par ajouter un matériel"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.n_materiel}>
                    {/* ID */}
                    <td>
                      <span className="row-id">#{m.n_materiel}</span>
                    </td>

                    {/* Design */}
                    <td className="design-cell">
                      {editId === m.n_materiel ? (
                        <input
                          className="edit-input"
                          value={editForm.design}
                          onChange={(e) =>
                            setEditForm({ ...editForm, design: e.target.value })
                          }
                        />
                      ) : (
                        m.design
                      )}
                    </td>

                    {/* État */}
                    <td>
                      {editId === m.n_materiel ? (
                        <select
                          className="edit-select"
                          value={editForm.etat}
                          onChange={(e) =>
                            setEditForm({ ...editForm, etat: e.target.value })
                          }
                        >
                          <option value="Bon">Bon</option>
                          <option value="Mauvais">Mauvais</option>
                          <option value="Abîmé">Abîmé</option>
                        </select>
                      ) : (
                        <span className={`etat-badge etat-${m.etat}`}>
                          <span className="etat-dot" />
                          {m.etat}
                        </span>
                      )}
                    </td>

                    {/* Quantité */}
                    <td className="qty-cell">
                      {editId === m.n_materiel ? (
                        <input
                          className="edit-input"
                          type="number"
                          min="0"
                          style={{ width: "80px" }}
                          value={editForm.quantite}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              quantite: e.target.value,
                            })
                          }
                        />
                      ) : (
                        m.quantite
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-buttons">
                        {editId === m.n_materiel ? (
                          <>
                            <button
                              className="btn btn-save"
                              onClick={() => saveEdit(m.n_materiel)}
                            >
                              💾 Sauvegarder
                            </button>
                            <button
                              className="btn btn-cancel"
                              onClick={cancelEdit}
                            >
                              ✖ Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-edit"
                              onClick={() => startEdit(m)}
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => confirmDelete(m)}
                            >
                              🗑️ Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Inline message */}
        {message && (
          <div className={`inline-message ${message.type}`}>
            <span className="inline-message-icon">
              {message.type === "success" ? "✅" : "❌"}
            </span>
            {message.text}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <ConfirmModal
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default ListMateriel;
