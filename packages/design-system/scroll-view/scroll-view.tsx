import { tw as tailwind } from '@showtime-xyz/universal.tailwind';
import { useMemo } from 'react';
import { ScrollView as ReactNativeScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ScrollViewProps } from './types';

function ScrollView({
  tw,
  style,
  asKeyboardAwareScrollView,
  ...props
}: ScrollViewProps) {
  const ScrollViewComponent = useMemo(() => {
    return asKeyboardAwareScrollView
      ? KeyboardAwareScrollView
      : ReactNativeScrollView;
  }, [asKeyboardAwareScrollView]);

  return (
    <ScrollViewComponent
      keyboardShouldPersistTaps="handled"
      {...props}
      style={[tailwind.style(tw), style]}
    />
  );
}

export { ScrollView };
