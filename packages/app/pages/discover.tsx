import { Platform } from 'react-native'
import dynamic from 'next/dynamic'

import createStackNavigator from 'app/navigation/create-stack-navigator'
import { DiscoverScreen } from 'app/screens/discover'
import { DiscoverStackParams } from 'app/navigation/types'
import { navigatorScreenOptions } from 'app/navigation/navigator-screen-options'

const LoginScreen = dynamic<JSX.Element>(() => import('app/screens/login').then(mod => mod.LoginScreen))
const NftScreen = dynamic<JSX.Element>(() => import('app/screens/nft').then(mod => mod.NftScreen))

const DiscoverStack = createStackNavigator<DiscoverStackParams>()

function DiscoverNavigator() {
	return (
		<DiscoverStack.Navigator
			// @ts-ignore
			screenOptions={navigatorScreenOptions}
		>
			<DiscoverStack.Group>
				<DiscoverStack.Screen
					name="discover"
					component={DiscoverScreen}
					options={{ title: 'Discover', headerTitle: 'Discover' }}
				/>
			</DiscoverStack.Group>
			<DiscoverStack.Group
				screenOptions={{
					headerShown: false,
					animation: Platform.OS === 'ios' ? 'default' : 'fade',
					presentation: Platform.OS === 'ios' ? 'formSheet' : 'transparentModal',
				}}
			>
				<DiscoverStack.Screen name="login" component={LoginScreen} />
				<DiscoverStack.Screen name="nft" component={NftScreen} />
			</DiscoverStack.Group>
		</DiscoverStack.Navigator>
	)
}

export default DiscoverNavigator
