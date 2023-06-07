import { StyleProp, Text, TextStyle } from 'react-native';
import useTheme from '../hooks/useTheme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

function Web3Text({ children, style }: Props) {
  const Theme = useTheme();
  return <Text style={[{ color: Theme.foreground1 }, style]}>{children}</Text>;
}

export default Web3Text;
