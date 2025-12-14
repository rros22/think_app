import { registerWebModule, NativeModule } from 'expo';

import { AppRemovalGuardModuleEvents } from './AppRemovalGuard.types';

class AppRemovalGuardModule extends NativeModule<AppRemovalGuardModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(AppRemovalGuardModule, 'AppRemovalGuardModule');
