import { useEffect, useState } from 'react';
import { Alert, View, Text, ActivityIndicator } from 'react-native';
import FormPengeluaran from '../components/FormPengeluaran';
import { apiFetch } from '../utils/api';
import { COLORS } from '../utils/constants';

export default function UbahScreen({ navigation, route }) {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/pengeluaran/${id}`).then(setItem).catch((e) => setError(e.message));
  }, [id]);

  const simpan = async (payload) => {
    try {
      await apiFetch(`/pengeluaran/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      navigation.navigate('Daftar', { notice: 'Perubahan tersimpan' });
    } catch (e) {
      Alert.alert('Gagal mengubah', e.message);
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: COLORS.danger, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }
  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FormPengeluaran
      title="Ubah Pengeluaran"
      subtitle="Perbarui catatan sesuai kebutuhan transaksi Anda."
      submitLabel="Simpan Perubahan"
      initial={item}
      onSubmit={simpan}
    />
  );
}
