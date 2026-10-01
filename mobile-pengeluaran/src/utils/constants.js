// GANTI dengan IPv4 laptop kamu (cek dengan `ipconfig`). Jangan pakai localhost.
// Emulator Android: http://10.0.2.2:3000
export const API_BASE = 'http:// 192.168.137.55:3000';

export const COLORS = {
  surface: '#F8F9FF',
  onSurface: '#0D1C2E',
  muted: '#5B6275',
  primary: '#2563EB',
  primaryDark: '#0040C8',
  container: '#E9EEFF',
  containerHigh: '#DCE5FF',
  border: '#D5DCF0',
  dark: '#1C2B45',
  white: '#FFFFFF',
  success: '#00693A',
  successBg: '#C9F7DA',
  danger: '#BA1A1A',
  dangerBg: '#FFDAD6',
  dangerStrong: '#B3261E',
};

// Sesuai seed database (app.js lama). Cek lagi dengan tabel kategori di backend.
export const KATEGORI = [
  { id: 1, nama: 'Pendidikan', icon: 'school' },
  { id: 2, nama: 'Makanan', icon: 'restaurant' },
  { id: 3, nama: 'Transport', icon: 'directions-car' },
  { id: 4, nama: 'Hiburan', icon: 'movie' },
];
