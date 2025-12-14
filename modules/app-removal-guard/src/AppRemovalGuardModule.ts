import { NativeModule, requireNativeModule } from 'expo';

import { AppRemovalGuardModuleEvents } from './AppRemovalGuard.types';

declare class AppRemovalGuardModule extends NativeModule<AppRemovalGuardModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AppRemovalGuardModule>('AppRemovalGuard');
