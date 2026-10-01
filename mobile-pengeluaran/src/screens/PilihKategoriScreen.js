import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { COLORS, KATEGORI } from '../utils/constants';

const KETERANGAN = {
  Makanan: 'Makan, minum & camilan',
  Transport: 'Bensin, parkir, ojek',
  Pendidikan: 'Buku, kursus, SPP',
  Hiburan: 'Game, streaming, bioskop',
};

// Layar "Pilih Kategori". Dibuka dari FormPengeluaran, hasilnya dikirim balik
// ke layar sebelumnya lewat param `kategoriId`.
export default function PilihKategoriScreen({ navigation, route }) {
  const [pilih, setPilih] = useState(route.params?.selectedId ?? null);

  const lanjut = () => {
    const { routes, index } = navigation.getState();
    const sebelumnya = routes[index - 1];
    if (sebelumnya) {
      navigation.dispatch({
        ...CommonActions.setParams({ kategoriId: pilih }),
        source: sebelumnya.key,
      });
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>Satu pilihan untuk melanjutkan.</Text>
      <Text style={s.subtitle}>Pilih kategori pengeluaran yang ingin dicatat</Text>

      {KATEGORI.map((k) => {
        const aktif = k.id === pilih;
        return (
          <Pressable key={k.id} onPress={() => setPilih(k.id)} style={[s.card, aktif && s.cardActive]}>
            <View style={s.icon}>
              <MaterialIcons name={k.icon} size={22} color={COLORS.primaryDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{k.nama}</Text>
              <Text style={s.desc}>
                ID Kategori: {k.id} • {KETERANGAN[k.nama] ?? ''}
              </Text>
            </View>
            <MaterialIcons
              name={aktif ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={24}
              color={aktif ? COLORS.primary : COLORS.border}
            />
          </Pressable>
        );
      })}

      <View style={s.info}>
        <MaterialIcons name="lightbulb-outline" size={18} color={COLORS.primaryDark} />
        <Text style={s.infoText}>Kategori memudahkan Anda memantau anggaran bulanan secara otomatis.</Text>
      </View>

      <Pressable style={[s.btn, pilih == null && { opacity: 0.5 }]} onPress={lanjut} disabled={pilih == null}>
        <Text style={s.btnText}>Pilih & Lanjutkan</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#fff" />
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.onSurface },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2, marginBottom: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10,
    borderRadius: 14, backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: 'transparent',
  },
  cardActive: { borderColor: COLORS.primary },
  icon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.container,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.onSurface },
  desc: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  info: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, padding: 14,
    borderRadius: 12, backgroundColor: COLORS.container,
  },
  infoText: { flex: 1, fontSize: 12, color: COLORS.muted, lineHeight: 18 },
  btn: {
    marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 999, backgroundColor: COLORS.primary,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});