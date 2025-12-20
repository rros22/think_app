import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { AntIconButton, Pressable, Text, View } from "../../components/Themed";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";

const buttonSize = 40;

const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

const ScheduleForm = () => {
  const colorScheme = useColorScheme() ?? "light";
  const separatorColor = Colors[colorScheme].separator;
  const [daysRowWidth, setDaysRowWidth] = React.useState(0);

  const router = useRouter();

  // Multi-select state (0 to 7 selected)
  // Storing indexes keeps it simple and stable.
  const [selectedDays, setSelectedDays] = React.useState(() => new Set());

  const toggleDay = React.useCallback((index) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const count = weekDays.length;

  /**
   * Requirement:
   * 1) Set spacing FIRST (fixed)
   * 2) Compute size from remaining width
   */
  const DAY_SPACING = 8; // spacing between days
  const ROW_PADDING_H = 0; // keep 0 unless you add paddingHorizontal to the days row

  const { size, radius, spacing } = React.useMemo(() => {
    if (!daysRowWidth) return { size: 50, radius: 20, spacing: DAY_SPACING };

    const available = Math.max(0, daysRowWidth - ROW_PADDING_H * 2);

    // Compute max possible square size AFTER reserving spacing
    const rawSize = Math.floor((available - (count - 1) * DAY_SPACING) / count);

    // Optional clamps for usability
    const computedSize = clamp(rawSize, 36, 999);

    return {
      size: computedSize,
      radius: Math.round(computedSize * 0.4),
      spacing: DAY_SPACING,
    };
  }, [daysRowWidth, count]);

  return (
    <View style={{ flex: 1, gap: 20 }}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 30,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        colorRole="card"
      >
        <Text style={styles.subTitle}>Nombre</Text>
        <Text colorRole="textSecondary" style={styles.subTitle}>
          ej. Trabajo, Estudio
        </Text>
      </View>

      <View
        colorRole="card"
        style={{
          paddingHorizontal: 20,
          gap: 20,
          borderRadius: 20,
          borderCurve: "continuous",
        }}
      >
        <View
          colorRole="card"
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: 30,
            borderRadius: 20,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.subTitle}>Comienza</Text>
          <Text style={styles.subTitle}>19:06</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: separatorColor }]} />
        <View
          colorRole="card"
          style={{
            width: "100%",
            flexDirection: "row",
            paddingVertical: 30,
            borderRadius: 20,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.subTitle}>Acaba</Text>
          <Text style={styles.subTitle}>Con tap</Text>
        </View>
      </View>

      <Pressable
        style={{
          width: "100%",
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 30,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        colorRole="card"
        onPress={() => router.push("/modeSelectionModal")}
      >
        <Text style={styles.subTitle}>Modo</Text>
        <Text style={styles.subTitle}>Deep Work</Text>
      </Pressable>

      <View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            marginTop: 15,
            marginBottom: 15,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.subTitle}>Repetir</Text>
          {selectedDays.size === 0 && (
            <Text colorRole="textSecondary">Selecciona al menos un día</Text>
          )}
        </View>

        {/* Days selector: select 0..7 */}
        <View
          onLayout={(e) => setDaysRowWidth(e.nativeEvent.layout.width)}
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: ROW_PADDING_H,
          }}
        >
          {weekDays.map((day, index) => {
            const isSelected = selectedDays.has(index);

            return (
              <Pressable
                key={`${day}-${index}`}
                onPress={() => toggleDay(index)}
                colorRole="card"
                style={{
                  height: size,
                  width: size,
                  borderRadius: radius,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: index === count - 1 ? 0 : spacing,

                  // Aesthetics: selected vs not selected
                  opacity: isSelected ? 1 : 0.35,
                }}
              >
                <Text style={styles.dayText}>{day}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default function ScheduleCreation() {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;
  const router = useRouter();

  const handleConfirmation = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionSlot} />
        <Text style={[styles.title]}>Crear Rutina</Text>
        <AntIconButton size={40} onPress={() => router.back()} />
      </View>
      <FlatList
        style={{ width: "100%", flex: 1 }}
        ListFooterComponent={ScheduleForm}
      />
      <Pressable
        onPress={handleConfirmation}
        style={[styles.submitButton, { borderColor: textColor }]}
      >
        <Text style={[styles.meta, { fontWeight: "500" }]}>Confirmar</Text>
      </Pressable>
    </View>
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

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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

  meta: {
    fontSize: 12,
    fontWeight: "400",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: -20,
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
