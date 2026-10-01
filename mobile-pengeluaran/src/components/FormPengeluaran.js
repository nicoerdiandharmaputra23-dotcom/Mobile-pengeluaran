import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, KATEGORI } from '../utils/constants';
import { getKategori, formatInputRupiah, parseRupiah, todayISO } from '../utils/helpers';

// Dipakai bersama oleh TambahScreen dan UbahScreen.
export default function FormPengeluaran({ title, subtitle, submitLabel, initial, onSubmit }) {
  const [judul, setJudul] = useState(initial?.judul ?? '');
  const [nominal, setNominal] = useState(
    initial?.nominal ? formatInputRupiah(String(Math.round(Number(initial.nominal)))) : ''
  );
  const [catatan, setCatatan] = useState(initial?.catatan ?? '');
  const [idKategori, setIdKategori] = useState(initial?.id_kategori ?? null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const kat = idKategori ? getKategori(idKategori) : null;

  const submit = async () => {
    const e = {};
    if (!judul.trim()) e.judul = 'Judul wajib diisi.';
    const n = parseRupiah(nominal);
    if (!n) e.nominal = 'Nominal harus lebih dari 0.';
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

      <Text style={s.label}>Kategori (ID)</Text>
      <View style={s.katCard}>
        <MaterialIcons name={kat ? kat.icon : 'category'} size={22} color={COLORS.primaryDark} />
        <Text style={s.katName}>{kat ? `${kat.nama} (ID: ${kat.id})` : 'Pilih kategori'}</Text>
        {kat && <MaterialIcons name="check-circle" size={22} color={COLORS.primary} />}
      </View>
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

      <Text style={s.label}>Judul pengeluaran</Text>
      <View style={[s.inputWrap, errors.judul && s.inputError]}>
        <TextInput
          style={s.input}
          value={judul}
          onChangeText={setJudul}
          placeholder="Contoh: Makan Siang"
          placeholderTextColor={COLORS.muted}
        />
        {judul.length > 0 && (
          <Pressable onPress={() => setJudul('')} hitSlop={8}>
            <MaterialIcons name="close" size={18} color={COLORS.muted} />
          </Pressable>
        )}
      </View>
      {errors.judul && <Text style={s.errText}>{errors.judul}</Text>}

      <Text style={s.label}>Nominal (Rp)</Text>
      <View style={[s.inputWrap, errors.nominal && s.inputError]}>
        <Text style={s.prefix}>Rp</Text>
        <TextInput
          style={s.input}
          value={nominal}
          onChangeText={(t) => setNominal(formatInputRupiah(t))}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={COLORS.muted}
        />
      </View>
      {errors.nominal && <Text style={s.errText}>{errors.nominal}</Text>}

      <Text style={s.label}>Catatan (opsional)</Text>
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
  label: { fontSize: 12, fontWeight: '700', color: COLORS.muted, marginTop: 18, marginBottom: 8 },
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
  errText: { color: COLORS.danger, fontSize: 12, marginTop: 6 },
  submit: {
    marginTop: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 999, backgroundColor: COLORS.primary,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
