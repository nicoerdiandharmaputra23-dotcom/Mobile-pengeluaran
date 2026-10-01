import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../utils/api';
import { COLORS } from '../utils/constants';
import { getKategori, formatTanggal, toRupiahDisplay } from '../utils/helpers';

export default function DaftarScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await apiFetch('/pengeluaran');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Muat ulang tiap kali layar ini kembali tampil (setelah tambah/ubah/hapus).
  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Banner sukses dari layar lain: navigation.navigate('Daftar', { notice: '...' })
  useEffect(() => {
    const n = route.params?.notice;
    if (!n) return;
    setNotice(n);
    navigation.setParams({ notice: undefined });
  }, [route.params?.notice, navigation]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const q = query.trim().toLowerCase();
  const filtered = items.filter((i) => {
    const nama = i.kategori || getKategori(i.id_kategori).nama;
    return (
      String(i.judul).toLowerCase().includes(q) ||
      nama.toLowerCase().includes(q) ||
      String(i.nominal).includes(q)
    );
  });

  const renderItem = ({ item }) => {
    const nama = item.kategori || getKategori(item.id_kategori).nama;
    return (
      <Pressable style={s.card} onPress={() => navigation.navigate('Detail', { id: item.id })}>
        <View style={s.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle} numberOfLines={1}>{item.judul}</Text>
            <Text style={s.cardMeta}>
              {formatTanggal(item.tanggal)} • ID: {item.id_kategori ?? '—'} ({nama})
            </Text>
          </View>
          <Text style={s.cardAmount}>{toRupiahDisplay(item.nominal)}</Text>
        </View>
        <View style={s.cardBottom}>
          <View style={s.tag}>
            <View style={s.tagDot} />
            <Text style={s.tagText}>Tersimpan</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={COLORS.muted} />
        </View>
      </Pressable>
    );
  };

  const empty = () => {
    if (loading) return <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />;
    if (error) {
      return (
        <View style={s.emptyBox}>
          <Text style={{ color: COLORS.danger, textAlign: 'center' }}>{error}</Text>
          <Pressable onPress={() => { setLoading(true); load(); }} style={s.retry}>
            <Text style={s.retryText}>Coba lagi</Text>
          </Pressable>
        </View>
      );
    }
    if (items.length === 0) {
      return (
        <View style={s.emptyBox}>
          <MaterialIcons name="add-circle-outline" size={44} color={COLORS.primary} />
          <Text style={s.emptyTitle}>Belum ada data</Text>
          <Text style={s.emptyText}>Tambahkan catatan pengeluaran pertama untuk mulai memantau anggaranmu.</Text>
        </View>
      );
    }
    return (
      <View style={s.emptyBox}>
        <Text style={s.emptyTitle}>Tidak ada hasil</Text>
        <Text style={s.emptyText}>Coba kata kunci lain.</Text>
      </View>
    );
  };

  return (
    <View style={[s.screen, { paddingTop: insets.top + 8 }]}>
      <View style={s.topBar}>
        <View style={s.brand}>
          <MaterialIcons name="account-balance-wallet" size={20} color={COLORS.primaryDark} />
          <Text style={s.brandText}>Data</Text>
        </View>
        <View style={s.avatar}>
          <MaterialIcons name="person" size={18} color="#fff" />
        </View>
      </View>

      <View style={s.head}>
        <Text style={s.title}>Data Pengeluaran</Text>
        <Text style={s.subtitle}>Kelola catatan pengeluaran dengan mudah.</Text>

        {notice && (
          <View style={s.notice}>
            <MaterialIcons name="check-circle" size={20} color={COLORS.success} />
            <Text style={s.noticeText}>{notice}</Text>
          </View>
        )}

        <View style={s.search}>
          <MaterialIcons name="search" size={20} color={COLORS.primaryDark} />
          <TextInput
            style={s.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Cari data pengeluaran..."
            placeholderTextColor={COLORS.muted}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={COLORS.muted} />
            </Pressable>
          )}
        </View>

        <View style={s.sectionRow}>
          <Text style={s.section}>Data terbaru</Text>
          <View style={s.count}>
            <Text style={s.countText}>{filtered.length} Transaksi</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        ListEmptyComponent={empty}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
        }
        keyboardShouldPersistTaps="handled"
      />

      <Pressable style={[s.fab, { bottom: insets.bottom + 24 }]} onPress={() => navigation.navigate('Tambah')}>
        <MaterialIcons name="add" size={22} color="#fff" />
        <Text style={s.fabText}>Tambah</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { fontSize: 18, fontWeight: '700', color: COLORS.onSurface },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center' },
  head: { paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.onSurface, marginTop: 8 },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  notice: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, padding: 12,
    borderRadius: 12, backgroundColor: COLORS.successBg,
  },
  noticeText: { flex: 1, color: COLORS.success, fontWeight: '700', fontSize: 13 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, paddingHorizontal: 14,
    borderRadius: 12, backgroundColor: COLORS.container,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.onSurface },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  section: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  count: { backgroundColor: COLORS.container, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  countText: { fontSize: 11, fontWeight: '700', color: COLORS.primaryDark },
  card: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#1C2B45', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardTop: { flexDirection: 'row', gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.onSurface },
  cardMeta: { fontSize: 12, color: COLORS.muted, marginTop: 3 },
  cardAmount: { fontSize: 16, fontWeight: '800', color: COLORS.primaryDark },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.successBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  tagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  tagText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  emptyBox: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 24, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.onSurface },
  emptyText: { fontSize: 13, color: COLORS.muted, textAlign: 'center' },
  retry: { marginTop: 8, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: COLORS.primary },
  retryText: { color: '#fff', fontWeight: '700' },
  fab: {
    position: 'absolute', right: 20, flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 14, borderRadius: 999, backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
