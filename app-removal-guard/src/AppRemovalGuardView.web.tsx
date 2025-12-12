import * as React from 'react';

import { AppRemovalGuardViewProps } from './AppRemovalGuard.types';

export default function AppRemovalGuardView(props: AppRemovalGuardViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
