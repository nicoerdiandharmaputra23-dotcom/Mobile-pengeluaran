import { API_BASE } from './constants';

export async function apiFetch(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error(
      'Tidak bisa terhubung ke server. Cek IP di constants.js dan pastikan HP satu Wi-Fi dengan laptop.'
    );
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ pesan: res.statusText }));
    throw new Error(err.pesan || 'Terjadi kesalahan');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
