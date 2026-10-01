import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { apiFetch } from '../utils/api';
import { COLORS } from '../utils/constants';
import { toRupiahDisplay } from '../utils/helpers';

export default function HapusScreen({ navigation, route }) {
  const { item } = route.params;
  const [deleting, setDeleting] = useState(false);

  const hapus = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/pengeluaran/${item.id}`, { method: 'DELETE' });
      navigation.navigate('Daftar', { notice: 'Catatan berhasil dihapus' });
    } catch (e) {
      Alert.alert('Gagal menghapus', e.message);
      setDeleting(false);
    }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>Konfirmasi</Text>
      <Text style={s.subtitle}>Tindakan ini akan menghapus catatan.</Text>

      <View style={s.card}>
        <View style={s.alertIcon}>
          <MaterialIcons name="priority-high" size={30} color={COLORS.danger} />
        </View>
        <Text style={s.cardTitle}>Hapus catatan?</Text>
        <Text style={s.cardText}>
          Data <Text style={s.bold}>{item.judul}</Text> •{' '}
          <Text style={s.bold}>{toRupiahDisplay(item.nominal)}</Text> [ID: {item.id_kategori ?? '—'}] akan
          dihapus secara permanen.
        </Text>

        <Pressable style={[s.btnDelete, deleting && { opacity: 0.7 }]} onPress={hapus} disabled={deleting}>
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="delete" size={18} color="#fff" />
              <Text style={s.btnDeleteText}>Ya, Hapus</Text>
            </>
          )}
        </Pressable>
        <Pressable style={s.btnCancel} onPress={() => navigation.goBack()} disabled={deleting}>
          <Text style={s.btnCancelText}>Batal</Text>
        </Pressable>
      </View>

      <View style={s.info}>
        <MaterialIcons name="info-outline" size={18} color={COLORS.primaryDark} />
        <Text style={s.infoText}>
          Catatan yang dihapus tidak dapat dipulihkan kembali ke riwayat transaksi Anda.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.onSurface },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2, marginBottom: 18 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20, alignItems: 'center',
    shadowColor: '#1C2B45', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  alertIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.dangerBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: COLORS.onSurface },
  cardText: { fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginTop: 8, marginBottom: 20 },
  bold: { fontWeight: '800', color: COLORS.onSurface },
  btnDelete: {
    alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingVertical: 15, borderRadius: 12, backgroundColor: COLORS.dangerStrong,
  },
  btnDeleteText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnCancel: {
    alignSelf: 'stretch', alignItems: 'center', paddingVertical: 15, borderRadius: 12,
    backgroundColor: COLORS.container, marginTop: 10,
  },
  btnCancelText: { color: COLORS.onSurface, fontSize: 15, fontWeight: '700' },
  info: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 28, padding: 14,
    borderRadius: 12, backgroundColor: COLORS.container,
  },
  infoText: { flex: 1, fontSize: 12, color: COLORS.muted, lineHeight: 18 },
});