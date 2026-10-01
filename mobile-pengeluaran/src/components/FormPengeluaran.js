import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, KATEGORI } from '../utils/constants';
import {
  getKategori, formatInputRupiah, formatInputNominal, parseNominal, todayISO,
} from '../utils/helpers';

function Label({ text, fix }) {
  return (
    <View style={s.labelRow}>
      <Text style={s.label}>{text}</Text>
      {fix ? <Text style={s.fixText}>Perlu dikoreksi</Text> : null}
    </View>
  );
}

function FieldError({ text }) {
  if (!text) return null;
  return (
    <View style={s.errRow}>
      <MaterialIcons name="warning" size={14} color={COLORS.danger} />
      <Text style={s.errText}>{text}</Text>
    </View>
  );
}

// Dipakai bersama oleh TambahScreen dan UbahScreen.
export default function FormPengeluaran({ title, subtitle, submitLabel, initial, onSubmit }) {
  const navigation = useNavigation();
  const route = useRoute();

  const [judul, setJudul] = useState(initial?.judul ?? '');
  const [nominal, setNominal] = useState(
    initial?.nominal ? formatInputRupiah(String(Math.round(Number(initial.nominal)))) : ''
  );
  const [catatan, setCatatan] = useState(initial?.catatan ?? '');
  const [idKategori, setIdKategori] = useState(initial?.id_kategori ?? null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Terima hasil dari layar "Pilih Kategori".
  const kategoriDariPicker = route.params?.kategoriId;
  useEffect(() => {
    if (kategoriDariPicker != null) setIdKategori(kategoriDariPicker);
  }, [kategoriDariPicker]);

  const bukaPicker = () => navigation.navigate('PilihKategori', { selectedId: idKategori });

  const kat = idKategori ? getKategori(idKategori) : null;

  const submit = async () => {
    const e = {};
    if (!judul.trim()) e.judul = 'Judul wajib diisi.';
    const n = parseNominal(nominal);
    if (n <= 0) e.nominal = 'Nominal harus lebih dari 0.';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    try {
      await onSubmit({
        judul: judul.trim(),
        nominal: n,
        id_kategori: idKategori,
        catatan: catatan.trim() || null,
        tanggal: initial?.tanggal ? String(initial.tanggal).slice(0, 10) : todayISO(),
      });
    } finally {
      setSaving(false);
    }
  };

  const hasError = Object.keys(errors).length > 0;

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.title}>{hasError ? 'Form belum valid' : title}</Text>
      <Text style={s.subtitle}>
        {hasError ? 'Ada bagian yang perlu diperbaiki sebelum disimpan.' : subtitle}
      </Text>

      <Label text="Kategori (ID)" />
      <Pressable style={s.katCard} onPress={bukaPicker}>
        <MaterialIcons name={kat ? kat.icon : 'category'} size={22} color={COLORS.primaryDark} />
        <Text style={s.katName}>{kat ? `${kat.nama} (ID: ${kat.id})` : 'Pilih kategori'}</Text>
        <MaterialIcons
          name={kat ? 'check-circle' : 'chevron-right'}
          size={24}
          color={kat ? COLORS.primary : COLORS.primaryDark}
        />
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {KATEGORI.map((k) => {
          const active = k.id === idKategori;
          return (
            <Pressable
              key={k.id}
              onPress={() => setIdKategori(k.id)}
              style={[s.pill, active && s.pillActive]}
            >
              <Text style={[s.pillText, active && s.pillTextActive]}>
                [ID: {k.id}] {k.nama}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Label text="Judul pengeluaran" fix={!!errors.judul} />
      <View style={[s.inputWrap, errors.judul && s.inputError]}>
        <TextInput
          style={s.input}
          value={judul}
          onChangeText={setJudul}
          placeholder="Contoh: Makan Siang"
          placeholderTextColor={COLORS.muted}
        />
        {errors.judul ? (
          <MaterialIcons name="error-outline" size={20} color={COLORS.danger} />
        ) : (
          judul.length > 0 && (
            <Pressable onPress={() => setJudul('')} hitSlop={8}>
              <MaterialIcons name="close" size={18} color={COLORS.muted} />
            </Pressable>
          )
        )}
      </View>
      <FieldError text={errors.judul} />

      <Label text="Nominal (Rp)" fix={!!errors.nominal} />
      <View style={[s.inputWrap, errors.nominal && s.inputError]}>
        <Text style={[s.prefix, errors.nominal && { color: COLORS.danger }]}>Rp</Text>
        <TextInput
          style={[s.input, errors.nominal && { color: COLORS.danger }]}
          value={nominal}
          onChangeText={(t) => setNominal(formatInputNominal(t))}
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
          placeholder="0"
          placeholderTextColor={COLORS.muted}
        />
        {errors.nominal && <MaterialIcons name="error-outline" size={20} color={COLORS.danger} />}
      </View>
      <FieldError text={errors.nominal} />

      <Label text="Catatan (opsional)" />
      <View style={[s.inputWrap, { alignItems: 'flex-start' }]}>
        <TextInput
          style={[s.input, { minHeight: 80, textAlignVertical: 'top' }]}
          value={catatan}
          onChangeText={setCatatan}
          multiline
          placeholder="Contoh: Warung Padang"
          placeholderTextColor={COLORS.muted}
        />
      </View>

      <View style={s.tips}>
        <View style={s.tipsIcon}>
          <MaterialIcons name="lightbulb-outline" size={20} color={COLORS.primaryDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.tipsTitle}>Tips pengisian cepat</Text>
          <Text style={s.tipsText}>
            Masukkan angka tanpa tanda minus atau titik untuk format otomatis.
          </Text>
        </View>
      </View>

      <Pressable style={[s.submit, saving && { opacity: 0.7 }]} onPress={submit} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={s.submitText}>{submitLabel}</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.onSurface },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2, marginBottom: 8 },
  labelRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    marginTop: 18, marginBottom: 8,
  },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.muted },
  fixText: { fontSize: 12, color: COLORS.danger },
  katCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14,
    borderRadius: 14, backgroundColor: COLORS.containerHigh,
  },
  katName: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.primaryDark },
  pill: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, marginRight: 8,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border,
  },
  pillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pillText: { fontSize: 12, fontWeight: '600', color: COLORS.onSurface },
  pillTextActive: { color: '#fff' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14,
    borderRadius: 12, backgroundColor: COLORS.container, borderWidth: 1, borderColor: 'transparent',
  },
  inputError: { backgroundColor: COLORS.dangerBg, borderColor: COLORS.danger },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: COLORS.onSurface },
  prefix: { fontSize: 15, fontWeight: '700', color: COLORS.muted },
  errRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  errText: { color: COLORS.danger, fontSize: 12 },
  tips: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24, padding: 14,
    borderRadius: 14, backgroundColor: COLORS.container,
  },
  tipsIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.containerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.onSurface },
  tipsText: { fontSize: 12, color: COLORS.muted, marginTop: 2, lineHeight: 17 },
  submit: {
    marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 999, backgroundColor: COLORS.primary,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});