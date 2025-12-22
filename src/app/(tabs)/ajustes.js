import { useCallback } from "react";
import { Platform, StyleSheet, Switch } from "react-native";

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "../../components/Themed";

import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

import { setDenyAppRemoval as _setDenyAppRemoval } from "app-removal-guard";
import { useAppStore } from "../../store/appConfigStore";

/**
 * Safe wrapper:
 * - iOS: calls app-removal-guard
 * - Android/others: no-op (prevents crash)
 */
function setDenyAppRemovalSafe(deny) {
  if (Platform.OS !== "ios") return { supported: false };

  try {
    const result = _setDenyAppRemoval(!!deny);
    return { supported: true, result };
  } catch (error) {
    console.warn("[AppRemovalGuard] setDenyAppRemoval failed:", error);
    return { supported: false, error };
  }
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? "light";

  const isBlockingActive = useAppStore((state) => state.isBlockingActive);

  // strict mode preference
  const preventDeletionWhileBlocked = useAppStore(
    (state) => state.preventDeletionWhileBlocked
  );
  const setPreventDeletionWhileBlocked = useAppStore(
    (state) => state.setPreventDeletionWhileBlocked
  );

  // Effective theme: force blocked when blocked, otherwise follow system
  const theme = isBlockingActive ? "blocked" : colorScheme;
  const textColor = Colors[theme].text;
  const separatorColor = Colors[theme].separator;

  // If strict mode is ON during an active session, do not allow turning it OFF mid-session
  const strictLocked = isBlockingActive && preventDeletionWhileBlocked;

  const handleToggleStrictMode = useCallback(
    (value) => {
      const next = !!value;

      // Disallow turning OFF while blocked (matches BlockScreen behavior)
      if (isBlockingActive && !next) return;

      // persist preference
      setPreventDeletionWhileBlocked(next);

      // apply immediately only if currently blocked
      if (isBlockingActive) {
        const r = setDenyAppRemovalSafe(next);
        console.log("[AppRemovalGuard] strictMode changed while blocked =>", r);
      }
    },
    [isBlockingActive, setPreventDeletionWhileBlocked]
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cuenta */}
        <View colorRole="card" style={styles.card}>
          <Text style={styles.title}>Cuenta</Text>
          <Text colorRole="textSecondary" style={styles.meta}>
            Conectado como ramonros22@hotmail.com
          </Text>
        </View>

        {/* Compartir */}
        <View colorRole="card" style={styles.card}>
          <Text style={styles.title}>Comparte think con un amigo</Text>

          <Text colorRole="textSecondary" style={styles.meta}>
            Haz que consigan un descuento del 10%.
          </Text>

          <Pressable
            colorRole="background"
            style={{
              marginTop: 10,
              padding: "6%",
              borderRadius: 40,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: textColor,
            }}
            onPress={() => {
              // TODO: implement share logic
            }}
          >
            <Text style={[styles.meta, { fontWeight: "600" }]}>
              Comparte ahora
            </Text>
          </Pressable>
        </View>

        {/* Desbloqueo */}
        <View colorRole="card" style={styles.card}>
          <Text style={styles.title}>Desbloqueo de emergencia</Text>
          <Text colorRole="textSecondary" style={styles.meta}>
            5 restantes
          </Text>

          <View style={[styles.divider, { backgroundColor: separatorColor }]} />

          <View colorRole="card" style={styles.row}>
            <Text style={styles.rowText}>Modo estricto</Text>
            <Switch
              value={preventDeletionWhileBlocked}
              onValueChange={handleToggleStrictMode}
              disabled={strictLocked}
            />
          </View>
        </View>

        {/* Sobre */}
        <View colorRole="card" style={styles.card}>
          <Text style={styles.title}>Sobre think.</Text>

          <Text
            colorRole="textSecondary"
            style={[styles.secondary, { marginTop: 12 }]}
          >
            ¿Por qué usar think?
          </Text>

          <View style={[styles.divider, { backgroundColor: separatorColor }]} />

          <Text colorRole="textSecondary" style={styles.secondary}>
            Política de Privacidad
          </Text>
        </View>

        {/* FAQ */}
        <View colorRole="card" style={styles.card}>
          <Text style={styles.title}>Preguntas frecuentes</Text>

          <Text
            colorRole="textSecondary"
            style={[styles.secondary, { marginTop: 12 }]}
          >
            ¿Problemas con think.?
          </Text>

          <View style={[styles.divider, { backgroundColor: separatorColor }]} />

          <Text colorRole="textSecondary" style={styles.secondary}>
            ¿Necesitas ayuda?
          </Text>

          <View style={[styles.divider, { backgroundColor: separatorColor }]} />

          <Text colorRole="textSecondary" style={styles.secondary}>
            Borrar cuenta
          </Text>
        </View>

        {/* Cerrar sesión */}
        <Pressable
          style={{
            marginTop: 10,
            padding: "6%",
            borderRadius: 40,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",

            borderWidth: 1,
            borderColor: textColor,

            // iOS
            shadowColor: separatorColor,
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,

            // Android
            elevation: 8,
          }}
          onPress={() => {
            // TODO: implement logout logic
          }}
        >
          <Text style={[styles.meta, { fontWeight: "500" }]}>
            Cerrar sesión
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    gap: 10,
    padding: "5%",
  },

  card: {
    width: "100%",
    minHeight: 80,
    borderRadius: 12,
    padding: "7.5%",
    gap: 8,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  rowText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    paddingRight: 12,
  },

  secondary: {
    fontSize: 16,
    fontWeight: "400",
  },

  meta: {
    fontSize: 12,
    fontWeight: "400",
  },

  divider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    marginVertical: 14,
  },

  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
});
