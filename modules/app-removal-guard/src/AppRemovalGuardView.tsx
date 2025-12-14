import { requireNativeView } from 'expo';
import * as React from 'react';

import { AppRemovalGuardViewProps } from './AppRemovalGuard.types';

const NativeView: React.ComponentType<AppRemovalGuardViewProps> =
  requireNativeView('AppRemovalGuard');

export default function AppRemovalGuardView(props: AppRemovalGuardViewProps) {
  return <NativeView {...props} />;
}
