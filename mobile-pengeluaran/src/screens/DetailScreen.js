import { useCallback, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, Modal, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { apiFetch } from '../utils/api';
import { COLORS } from '../utils/constants';
import { getKategori, formatTanggal, toRupiahDisplay } from '../utils/helpers';

function Row({ icon, label, value, strong }) {
  return (
    <View style={s.row}>
      <MaterialIcons name={icon} size={20} color={COLORS.muted} />
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, strong && { color: COLORS.primaryDark }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export default function DetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      apiFetch(`/pengeluaran/${id}`)
        .then((d) => { setItem(d); setError(null); })
        .catch((e) => setError(e.message));
    }, [id])
  );

  const hapus = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/pengeluaran/${id}`, { method: 'DELETE' });
      setConfirm(false);
      navigation.navigate('Daftar', { notice: 'Catatan berhasil dihapus' });
    } catch (e) {
      setConfirm(false);
      Alert.alert('Gagal menghapus', e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <View style={s.center}>
        <Text style={{ color: COLORS.danger, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }
  if (!item) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  const kat = getKategori(item.id_kategori);
  const namaKat = item.kategori || kat.nama;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>Detail Pengeluaran</Text>
      <Text style={s.subtitle}>Informasi lengkap dari satu catatan.</Text>

      <View style={s.hero}>
        <View style={s.heroTop}>
          <Text style={s.heroLabel}>Kategori pengeluaran</Text>
          <View style={s.heroBadge}>
            <Text style={s.heroBadgeText}># ID Kategori: {item.id_kategori ?? '—'}</Text>
          </View>
        </View>
        <View style={s.heroMain}>
          <View style={s.heroIcon}>
            <MaterialIcons name={kat.icon} size={24} color="#fff" />
          </View>
          <Text style={s.heroName}>{namaKat}</Text>
        </View>
      </View>

      <Text style={s.section}>Detail transaksi</Text>
      <Row icon="subject" label="Judul" value={item.judul || '—'} />
      <Row icon="schedule" label="Waktu" value={formatTanggal(item.tanggal)} />
      <Row icon="attach-money" label="Total nominal" value={toRupiahDisplay(item.nominal)} strong />
      {item.catatan ? <Row icon="notes" label="Catatan" value={item.catatan} /> : null}

      <View style={s.actions}>
        <Pressable style={[s.btn, s.btnEdit]} onPress={() => navigation.navigate('Ubah', { id })}>
          <MaterialIcons name="edit" size={18} color={COLORS.primaryDark} />
          <Text style={[s.btnText, { color: COLORS.primaryDark }]}>Ubah</Text>
        </Pressable>
           <Pressable style={[s.btn, s.btnDelete]} onPress={() => navigation.navigate('Hapus', { item })}>
          <MaterialIcons name="delete" size={18} color={COLORS.danger} />
          <Text style={[s.btnText, { color: COLORS.danger }]}>Hapus</Text>
        </Pressable>
      </View>

      <Modal visible={confirm} transparent animationType="fade" onRequestClose={() => setConfirm(false)}>
        <View style={s.backdrop}>
          <View style={s.dialog}>
            <View style={s.alertIcon}>
              <MaterialIcons name="priority-high" size={26} color={COLORS.danger} />
            </View>
            <Text style={s.dialogTitle}>Hapus catatan?</Text>
            <Text style={s.dialogText}>
              Data {item.judul} • {toRupiahDisplay(item.nominal)} (ID: {item.id_kategori ?? '—'})
              akan dihapus secara permanen.
            </Text>
            <Pressable style={s.dialogDelete} onPress={hapus} disabled={deleting}>
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.dialogDeleteText}>Ya, Hapus</Text>
              )}
            </Pressable>
            <Pressable style={s.dialogCancel} onPress={() => setConfirm(false)} disabled={deleting}>
              <Text style={s.dialogCancelText}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: COLORS.surface },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.onSurface },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2, marginBottom: 16 },
  hero: { backgroundColor: COLORS.dark, borderRadius: 16, padding: 18 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLabel: { color: '#B8C4DC', fontSize: 11 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  heroBadgeText: { color: '#E5ECFF', fontSize: 11 },
  heroMain: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  heroIcon: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroName: { color: '#fff', fontSize: 24, fontWeight: '700' },
  section: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginTop: 22, marginBottom: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, marginBottom: 8,
    backgroundColor: COLORS.white, borderRadius: 14,
  },
  rowLabel: { fontSize: 14, color: COLORS.muted },
  rowValue: { flex: 1, textAlign: 'right', fontSize: 14, fontWeight: '700', color: COLORS.onSurface },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 14, borderRadius: 12 },
  btnEdit: { backgroundColor: COLORS.containerHigh },
  btnDelete: { backgroundColor: COLORS.dangerBg },
  btnText: { fontSize: 14, fontWeight: '700' },
  backdrop: { flex: 1, backgroundColor: 'rgba(13,28,46,0.5)', justifyContent: 'center', padding: 24 },
  dialog: { backgroundColor: COLORS.white, borderRadius: 20, padding: 22, alignItems: 'center' },
  alertIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.dangerBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  dialogTitle: { fontSize: 18, fontWeight: '800', color: COLORS.onSurface },
  dialogText: { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginTop: 8, marginBottom: 18, lineHeight: 19 },
  dialogDelete: { alignSelf: 'stretch', alignItems: 'center', paddingVertical: 14, borderRadius: 10, backgroundColor: COLORS.dangerStrong },
  dialogDeleteText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  dialogCancel: { alignSelf: 'stretch', alignItems: 'center', paddingVertical: 14, borderRadius: 10, backgroundColor: COLORS.container, marginTop: 10 },
  dialogCancelText: { color: COLORS.onSurface, fontWeight: '700', fontSize: 15 },
});
