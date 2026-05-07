const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET - Bilan (doit être avant /:id)
router.get('/bilan', async (req, res) => {
  try {
    const [totalRows] = await db.execute('SELECT COALESCE(SUM(quantite), 0) as total FROM materiel');
    const [etatRows] = await db.execute(
      "SELECT etat, COUNT(*) as nb_articles, COALESCE(SUM(quantite), 0) as total_quantite FROM materiel GROUP BY etat"
    );
    res.json({
      total: totalRows[0].total,
      parEtat: etatRows
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// GET - Tous les matériels
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM materiel ORDER BY n_materiel DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST - Ajouter un matériel
router.post('/', async (req, res) => {
  const { design, etat, quantite } = req.body;

  if (!design || !etat || quantite === undefined || quantite === null) {
    return res.status(400).json({ message: 'Insertion échouée : tous les champs sont requis.' });
  }

  if (!['Bon', 'Mauvais', 'Abîmé'].includes(etat)) {
    return res.status(400).json({ message: "Insertion échouée : état invalide." });
  }

  if (parseInt(quantite) < 0) {
    return res.status(400).json({ message: 'Insertion échouée : la quantité doit être positive.' });
  }

  try {
    await db.execute(
      'INSERT INTO materiel (design, etat, quantite) VALUES (?, ?, ?)',
      [design, etat, parseInt(quantite)]
    );
    res.status(201).json({ message: 'Insertion réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Insertion échouée' });
  }
});

// PUT - Modifier un matériel
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { design, etat, quantite } = req.body;

  if (!design || !etat || quantite === undefined || quantite === null) {
    return res.status(400).json({ message: 'Modification échouée : tous les champs sont requis.' });
  }

  if (!['Bon', 'Mauvais', 'Abîmé'].includes(etat)) {
    return res.status(400).json({ message: "Modification échouée : état invalide." });
  }

  try {
    const [result] = await db.execute(
      'UPDATE materiel SET design = ?, etat = ?, quantite = ? WHERE n_materiel = ?',
      [design, etat, parseInt(quantite), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Modification échouée : matériel non trouvé.' });
    }

    res.json({ message: 'Modification réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Modification échouée' });
  }
});

// DELETE - Supprimer un matériel
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM materiel WHERE n_materiel = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Suppression échouée : matériel non trouvé.' });
    }

    res.json({ message: 'Suppression réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Suppression échouée' });
  }
});

module.exports = router;
