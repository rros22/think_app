import { requireNativeModule } from 'expo-modules-core';

const AppRemovalGuard = requireNativeModule('AppRemovalGuard');

export function setDenyAppRemoval(deny:any) {
  return AppRemovalGuard.setDenyAppRemoval(!!deny);
}
