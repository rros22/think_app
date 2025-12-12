import React from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import * as ReactNativeDeviceActivity from "react-native-device-activity";
import { Text, View } from '../../components/Themed';
import { useDeviceActivity } from '../../context/DeviceActivityContext';

export default function TabTwoScreen() {
  const { familyActivitySelection, setFamilyActivitySelection } = useDeviceActivity();
  const [isPickerVisible, setPickerVisible] = React.useState(false);

  const handleBlockedApps = () => {
    setPickerVisible(true);
  };

  const handleSelectionChange = (event) => {
    const selection = event?.nativeEvent?.familyActivitySelection ?? null;
    setFamilyActivitySelection(selection);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.appsButton} onPress={handleBlockedApps}>
        <Text style={styles.buttonText}>Select Apps</Text>
      </Pressable>

      <Modal
        visible={isPickerVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setPickerVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.closeButton} onPress={() => setPickerVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.pickerContainer}>
            <ReactNativeDeviceActivity.DeviceActivitySelectionView
              familyActivitySelection={familyActivitySelection}
              onSelectionChange={handleSelectionChange}
              style={styles.picker}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appsButton: {
    width: 140,
    height: 44,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContainer: { flex: 1 },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#111',
  },
  closeButtonText: { color: '#fff', fontWeight: '600' },
  pickerContainer: { flex: 1 },
  picker: { flex: 1, width: '100%' },
});
