import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";

export default function CreateMode() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>Second Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
