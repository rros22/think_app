import ExpoModulesCore
import ManagedSettings

public class AppRemovalGuardModule: Module {
  private let store = ManagedSettingsStore()

  public func definition() -> ModuleDefinition {
    Name("AppRemovalGuard")

    Function("setDenyAppRemoval") { (deny: Bool) -> String in
      if deny {
        store.application.denyAppRemoval = true
      } else {
        // Clear our managed setting (preferred)
        store.application.denyAppRemoval = nil
      }

      return store.application.denyAppRemoval == nil ? "nil" : "true"
    }
  }
}
