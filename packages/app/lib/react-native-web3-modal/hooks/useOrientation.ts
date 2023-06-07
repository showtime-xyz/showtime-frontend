import { useWindowDimensions } from 'react-native';

export function useOrientation() {
  const window = useWindowDimensions();

  return {
    width: window.width,
    height: window.height,
    isPortrait: window.height >= window.width,
  };
}
