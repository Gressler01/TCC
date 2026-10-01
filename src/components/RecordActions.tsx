import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

export type RecordActionsProps = {
  onEdit: () => void;
  onDelete: () => Promise<void>;
};

export function RecordActions({ onEdit, onDelete }: RecordActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const deleting = useRef(false);

  async function remove() {
    if (deleting.current) return;
    deleting.current = true;
    setBusy(true);
    setError('');
    try {
      await onDelete();
      setConfirming(false);
    } catch {
      setError('Não foi possível excluir. Confira sua conexão e a permissão do aparelho e tente novamente.');
    } finally {
      deleting.current = false;
      setBusy(false);
    }
  }

  return (
    <>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onEdit} style={styles.button}>
          <Text style={styles.edit}>Editar</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => { setError(''); setConfirming(true); }} style={styles.button}>
          <Text style={styles.remove}>Excluir</Text>
        </Pressable>
      </View>
      <Modal transparent visible={confirming} animationType="fade" onRequestClose={() => { if (!deleting.current) setConfirming(false); }}>
        <View style={styles.overlay}>
          <View style={styles.dialog} accessibilityViewIsModal>
            <Text style={styles.title}>Excluir este registro?</Text>
            <Text style={styles.message}>Esta ação não pode ser desfeita. O registro será removido dos dados da granja.</Text>
            {error ? <Text accessibilityRole="alert" style={styles.remove}>{error}</Text> : null}
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" disabled={busy} onPress={() => setConfirming(false)} style={styles.button}>
                <Text style={styles.edit}>Cancelar</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={busy} onPress={remove} style={styles.button}>
                <Text style={styles.remove}>{busy ? 'Excluindo...' : 'Excluir'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 12, paddingTop: 4 },
  button: { minHeight: 44, minWidth: 72, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center' },
  edit: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  remove: { color: '#B42318', fontSize: 14, fontWeight: '600' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 24 },
  dialog: { backgroundColor: colors.white, borderRadius: 14, padding: 24, width: '100%', maxWidth: 420, gap: 12 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  message: { color: colors.textMuted, fontSize: 14, lineHeight: 22 },
});
