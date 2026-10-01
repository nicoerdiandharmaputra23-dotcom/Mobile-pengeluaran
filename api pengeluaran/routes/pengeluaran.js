import { Router } from 'express';
import { pool } from '../db.js';   // perhatikan: ../db.js karena beda folder

const router = Router();

// GET semua pengeluaran (join kategori)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.judul, p.nominal, p.tanggal, p.catatan, p.id_kategori,
              k.nama AS kategori
       FROM pengeluaran p
       LEFT JOIN kategori k ON p.id_kategori = k.id
       ORDER BY p.tanggal DESC, p.dibuat_pada DESC`
    );
    res.json(rows);
  } catch (e) {
    console.error('Error GET pengeluaran:', e);
    res.status(500).json({ pesan: e.message || 'Gagal mengambil data' });
  }
});

// GET satu pengeluaran by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, k.nama AS kategori
       FROM pengeluaran p
       LEFT JOIN kategori k ON p.id_kategori = k.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ pesan: 'Data tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (e) {
    console.error('Error GET pengeluaran by id:', e);
    res.status(500).json({ pesan: e.message || 'Gagal mengambil data' });
  }
});

// POST tambah pengeluaran baru
router.post('/', async (req, res) => {
  const { judul, nominal, id_kategori, catatan, tanggal } = req.body;
  if (!judul || !nominal) {
    return res.status(400).json({ pesan: 'judul & nominal wajib' });
  }
  try {
    const [hasil] = await pool.query(
      `INSERT INTO pengeluaran (judul, nominal, id_kategori, catatan, tanggal)
       VALUES (?, ?, ?, ?, ?)`,
      [
        judul,
        Number(nominal),
        id_kategori ?? null,
        catatan ?? null,
        tanggal ?? null,
      ]
    );
    res.status(201).json({ id: hasil.insertId, judul, nominal });
  } catch (e) {
    console.error('Error POST pengeluaran:', e);
    res.status(500).json({ pesan: e.message || 'Gagal menyimpan data' });
  }
});

// PUT update pengeluaran
router.put('/:id', async (req, res) => {
  const { judul, nominal, id_kategori, catatan, tanggal } = req.body;
  if (!judul || !nominal) {
    return res.status(400).json({ pesan: 'judul & nominal wajib' });
  }
  try {
    const [hasil] = await pool.query(
      `UPDATE pengeluaran
       SET judul = ?, nominal = ?, id_kategori = ?, catatan = ?, tanggal = ?
       WHERE id = ?`,
      [
        judul,
        Number(nominal),
        id_kategori ?? null,
        catatan ?? null,
        tanggal ?? null,
        req.params.id,
      ]
    );
    if (hasil.affectedRows === 0) {
      return res.status(404).json({ pesan: 'Data tidak ditemukan' });
    }
    res.json({ id: Number(req.params.id), judul, nominal });
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal mengubah data' });
  }
});

// DELETE hapus pengeluaran
router.delete('/:id', async (req, res) => {
  try {
    const [hasil] = await pool.query(
      'DELETE FROM pengeluaran WHERE id = ?', [req.params.id]
    );
    if (hasil.affectedRows === 0) {
      return res.status(404).json({ pesan: 'Data tidak ditemukan' });
    }
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal menghapus data' });
  }
});

export default router;