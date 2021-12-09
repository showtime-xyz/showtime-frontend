import { Text, TextProps } from 'react-native'

export const Label = ({ htmlFor, ...rest }: TextProps & { htmlFor?: string }) => <Text {...rest} />
