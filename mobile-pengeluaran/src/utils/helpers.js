import { KATEGORI } from './constants';

export function getKategori(id) {
  return (
    KATEGORI.find((k) => k.id === Number(id)) || {
      id: null,
      nama: 'Tanpa Kategori',
      icon: 'category',
    }
  );
}

const titik = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const toRupiahDisplay = (num) => 'Rp ' + titik(Math.round(Number(num) || 0));
export const parseRupiah = (str) => parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;
export const formatInputRupiah = (text) => {
  const n = parseRupiah(text);
  return n ? titik(n) : '';
};

// Seperti formatInputRupiah, tapi tanda minus di depan tetap dipertahankan.
export const formatInputNominal = (text) => {
  const negatif = String(text).trim().startsWith('-');
  const n = parseRupiah(text);
  if (!n) return negatif ? '-' : '';
  return (negatif ? '-' : '') + titik(n);
};

// Mengubah teks input jadi angka, termasuk nilai negatif.
export const parseNominal = (str) => {
  const negatif = String(str).trim().startsWith('-');
  const n = parseRupiah(str);
  return negatif ? -n : n;
};

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export function formatTanggal(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = String(dateStr).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return String(dateStr);
  return `${d} ${BULAN[m - 1]} ${y}`;
}

export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}