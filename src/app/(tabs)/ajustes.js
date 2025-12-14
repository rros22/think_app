import { useCallback } from "react";
import { StyleSheet, Switch } from "react-native";

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "../../components/Themed";

import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

import { setDenyAppRemoval } from "app-removal-guard";
import { useConfigStore } from "../../store/configStore"; // adjust path if needed

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;

  const isBlocked = useConfigStore((s) => s.isBlocked);
  const preventDeletionWhileBlocked = useConfigStore(
    (s) => s.preventDeletionWhileBlocked
  );
  const setPreventDeletionWhileBlocked = useConfigStore(
    (s) => s.setPreventDeletionWhileBlocked
  );

  const handleToggleStrictMode = useCallback(
    (value) => {
      const next = !!value;

      // Disallow turning OFF while blocked (matches previous behavior)
      if (isBlocked && next === false) {
        return;
      }

      setPreventDeletionWhileBlocked(next);

      // If currently blocked, apply immediately
      if (isBlocked && next === true) {
        const r = setDenyAppRemoval(true);
        console.log(
          "[AppRemovalGuard] setDenyAppRemoval(activated while blocked) =>",
          r
        );
      }

      // If not blocked, keep the system permissive when strictMode is off
      if (!isBlocked && next === false) {
        const r = setDenyAppRemoval(false);
        console.log(
          "[AppRemovalGuard] setDenyAppRemoval(strictMode off) =>",
          r
        );
      }
    },
    [isBlocked, setPreventDeletionWhileBlocked]
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
              marginTop: "10",
              padding: "6%",
              borderRadius: 40,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: textColor,
            }}
            onPress={() => {
              // TODO: implement logout logic
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

          <View colorRole="separator" style={styles.divider} />

          <View colorRole="card" style={styles.row}>
            <Text style={styles.rowText}>Modo estricto</Text>
            <Switch
              value={!!preventDeletionWhileBlocked}
              onValueChange={handleToggleStrictMode}
              disabled={isBlocked && !!preventDeletionWhileBlocked}
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

          <View colorRole="separator" style={styles.divider} />

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

          <View colorRole="separator" style={styles.divider} />

          <Text colorRole="textSecondary" style={styles.secondary}>
            ¿Necesitas ayuda?
          </Text>

          <View colorRole="separator" style={styles.divider} />

          <Text colorRole="textSecondary" style={styles.secondary}>
            Borrar cuenta
          </Text>
        </View>

        {/* Cerrar sesión */}
        <Pressable
          style={{
            marginTop: "10",
            padding: "6%",
            borderRadius: 40,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: textColor,
            // iOS
            shadowColor: "#000",
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            borderWidth: 1,
            borderColor: textColor,

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

  logoutButton: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },

  primaryActionButton: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
});
