import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import {
  AntIconButton,
  Pressable,
  Text,
  View,
} from "../../../components/Themed";
import { useColorScheme } from "../../../components/useColorScheme";
import Colors from "../../../constants/Colors";
import { useAppStore } from "../../../store/appConfigStore";

const buttonSize = 40;
const dividerOpacity = 0.5;
const MAX_NAME_LEN = 30;

export default function EditMode() {
  const { id } = useLocalSearchParams();
  const routeId = Array.isArray(id) ? id[0] : id;

  const router = useRouter();

  const createMode = useAppStore((state) => state.createMode);
  const updateMode = useAppStore((state) => state.updateMode);
  const deleteMode = useAppStore((state) => state.deleteMode);

  const isCreate = routeId === "create";
  const isEdit = !isCreate;

  // Draft id we create immediately in create flow
  const [draftId, setDraftId] = useState(null);

  // If user saves, we do NOT delete on unmount
  const didSaveRef = useRef(false);

  // Effective mode id for this screen
  const effectiveModeId = isCreate ? draftId : routeId;

  const mode = useAppStore((state) =>
    effectiveModeId ? (state.modesById[effectiveModeId] ?? null) : null
  );

  const [name, setName] = useState("");

  const colorScheme = useColorScheme() ?? "light";
  const separatorColor = Colors[colorScheme].separator;
  const textColor = Colors[colorScheme].text;

  // 1) Create draft mode immediately when entering create flow
  useEffect(() => {
    if (!isCreate) return;
    if (draftId) return;

    const newId = createMode({ name: "", blockedAppSelection: null });

    if (!newId) {
      Alert.alert(
        "Límite alcanzado",
        "No puedes crear más modos. Elimina uno para crear otro."
      );
      router.back();
      return;
    }

    setDraftId(newId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreate, draftId]);

  // 2) Initialize local name when the mode becomes available (draft or edit)
  useEffect(() => {
    if (!mode) return;
    setName(mode.name ?? "");
  }, [mode?.id]);

  const hasSelection = useMemo(() => {
    return !!mode?.blockedAppSelection;
  }, [mode?.blockedAppSelection]);

  // 3) Delete draft if user leaves screen without saving (ANY exit path)
  useEffect(() => {
    if (!isCreate) return;

    return () => {
      if (!didSaveRef.current && draftId) {
        deleteMode(draftId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreate, draftId]);

  const handleClose = () => {
    // Leaving triggers cleanup on unmount (draft deletion if not saved)
    router.back();
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (!effectiveModeId) return;

    didSaveRef.current = true;
    updateMode(effectiveModeId, { name: trimmed });

    router.back();
  };

  const handleDelete = () => {
    if (!isEdit) return;
    if (!effectiveModeId) return;

    Alert.alert(
      "Eliminar modo",
      "¿Estás seguro de que quieres eliminar este modo? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteMode(effectiveModeId);
            router.back();
          },
        },
      ]
    );
  };

  const handleOpenAppSelection = () => {
    // In create flow, wait until draftId exists
    if (!effectiveModeId) return;

    router.push({
      pathname: "/appSelectionModal",
      params: { modeId: effectiveModeId },
    });
  };

  if (!routeId) return null;
  // While creating, wait one render until draftId exists
  if (isCreate && !draftId) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.actionSlot} />

          <Text style={styles.title}>
            {isEdit ? "Editar modo" : "Crear modo"}
          </Text>

          <AntIconButton size={40} onPress={handleClose} />
        </View>

        {/* Main content */}
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            colorRole="card"
            style={{
              width: "100%",
              paddingVertical: 30,
              paddingHorizontal: 20,
              borderRadius: 20,
              gap: 30,
              borderCurve: "continuous",
            }}
          >
            <View
              colorRole="card"
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.mediumText, { opacity: 0.5 }]}>Name</Text>

              <View style={{ flex: 1 }} />

              <TextInput
                value={name}
                onChangeText={(t) => setName(t.slice(0, MAX_NAME_LEN))}
                placeholder="ej. Trabajo, Familia"
                placeholderTextColor={textColor + "33"}
                caretColor={textColor}
                selectionColor={textColor}
                maxLength={MAX_NAME_LEN}
                autoCorrect={false}
                autoCapitalize="sentences"
                style={[
                  styles.mediumText,
                  {
                    width: "40%",
                    textAlign: "right",
                    color: textColor,
                    padding: 0,
                    margin: 0,
                    lineHeight: 18,
                  },
                ]}
              />
            </View>

            {/* Separator */}
            <View
              style={[
                styles.dividerHorizontal,
                {
                  backgroundColor: separatorColor,
                  opacity: dividerOpacity,
                  width: "100%",
                },
              ]}
            />

            <Pressable
              colorRole="card"
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={handleOpenAppSelection}
            >
              <Text style={[styles.mediumText, { opacity: 0.5 }]}>
                Bloqueando
              </Text>
              <Text style={[styles.mediumText, { opacity: 0.2 }]}>
                {hasSelection ? "Configurado" : "Añadir"}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          style={[styles.submitButton, { borderColor: textColor }]}
        >
          <Text style={styles.mediumText}>Guardar ajustes</Text>
        </Pressable>

        {/* Hide delete button during creation flow */}
        {isEdit && (
          <Pressable
            onPress={handleDelete}
            style={[styles.submitButton, { borderColor: textColor }]}
          >
            <Text style={styles.mediumText}>Eliminar modo</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: "5%",
  },
  actionSlot: {
    width: buttonSize,
  },
  dividerHorizontal: {
    height: StyleSheet.hairlineWidth,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
  },
  submitButton: {
    padding: "6%",
    borderRadius: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
  },
  mediumText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
