import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Save,
  X,
  Inbox,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  getAllMateriel,
  updateMateriel,
  deleteMateriel,
} from "../services/api";

const FILTERS = ["Tous", "Bon", "Mauvais", "Abîmé"];

/* ── Confirm delete modal ── */
function ConfirmModal({ item, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrapper">
          <Trash2 size={26} />
        </div>
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

/* ── Etat icon helper ── */
function EtatIcon({ etat, size = 14 }) {
  if (etat === "Bon") return <CheckCircle2 size={size} />;
  if (etat === "Mauvais") return <XCircle size={size} />;
  return <AlertTriangle size={size} />;
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

  /* Skeleton rows */
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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Liste & Gestion</h1>
          <p className="page-subtitle">
            Consultez, modifiez et supprimez les matériels enregistrés
          </p>
        </div>
        <span className="page-badge">
          <Filter size={13} /> {materiels.length} matériel(s)
        </span>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="table-toolbar">
          {/* Search */}
          <div className="search-box">
            <span className="search-icon">
              <Search size={15} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* State filters */}
          <div className="filter-buttons">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? `active-${f}` : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "Bon" && (
                  <CheckCircle2
                    size={12}
                    style={{ marginRight: "4px", verticalAlign: "middle" }}
                  />
                )}
                {f === "Mauvais" && (
                  <XCircle
                    size={12}
                    style={{ marginRight: "4px", verticalAlign: "middle" }}
                  />
                )}
                {f === "Abîmé" && (
                  <AlertTriangle
                    size={12}
                    style={{ marginRight: "4px", verticalAlign: "middle" }}
                  />
                )}
                {f}
              </button>
            ))}
          </div>

          <span className="table-meta">{filtered.length} résultat(s)</span>
        </div>

        {/* Table */}
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
                      <div className="empty-state-icon">
                        <Inbox size={52} />
                      </div>
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
                    <td>
                      <span className="row-id">#{m.n_materiel}</span>
                    </td>

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

                    <td>
                      <div className="action-buttons">
                        {editId === m.n_materiel ? (
                          <>
                            <button
                              className="btn btn-save"
                              onClick={() => saveEdit(m.n_materiel)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <Save size={13} /> Sauvegarder
                            </button>
                            <button
                              className="btn btn-cancel"
                              onClick={cancelEdit}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <X size={13} /> Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-edit"
                              onClick={() => startEdit(m)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <Pencil size={13} /> Modifier
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => setDeleteTarget(m)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                              }}
                            >
                              <Trash2 size={13} /> Supprimer
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
