import { Alert } from 'react-native';
import FormPengeluaran from '../components/FormPengeluaran';
import { apiFetch } from '../utils/api';

export default function TambahScreen({ navigation }) {
  const simpan = async (payload) => {
    try {
      await apiFetch('/pengeluaran', { method: 'POST', body: JSON.stringify(payload) });
      navigation.navigate('Daftar', { notice: 'Data berhasil disimpan' });
    } catch (e) {
      Alert.alert('Gagal menyimpan', e.message);
    }
  };

  return (
    <FormPengeluaran
      title="Tambah Pengeluaran"
      subtitle="Periksa kembali sebelum disimpan."
      submitLabel="Simpan Data"
      onSubmit={simpan}
    />
  );
}
