import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";

export default function EditMode() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>Edit Mode</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
