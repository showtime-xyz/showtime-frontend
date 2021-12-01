import { Platform } from 'react-native'
import dynamic from 'next/dynamic'

import createStackNavigator from 'app/navigation/create-stack-navigator'
import { HomeScreen } from 'app/screens/home'
import { HomeStackParams } from 'app/navigation/types'
import { navigatorScreenOptions } from 'app/navigation/navigator-screen-options'

const LoginScreen = dynamic<JSX.Element>(() => import('app/screens/login').then(mod => mod.LoginScreen))
const NftScreen = dynamic<JSX.Element>(() => import('app/screens/nft').then(mod => mod.NftScreen))

const HomeStack = createStackNavigator<HomeStackParams>()

function HomeNavigator() {
	return (
		<HomeStack.Navigator
			// @ts-ignore
			screenOptions={navigatorScreenOptions}
		>
			<HomeStack.Group>
				<HomeStack.Screen
					name="home"
					component={HomeScreen}
					options={{ title: 'Home', headerTitle: 'Showtime' }}
				/>
			</HomeStack.Group>
			<HomeStack.Group
				screenOptions={{
					headerShown: false,
					animation: Platform.OS === 'ios' ? 'default' : 'fade',
					presentation: Platform.OS === 'ios' ? 'formSheet' : 'transparentModal',
				}}
			>
				<HomeStack.Screen name="login" component={LoginScreen} />
				<HomeStack.Screen name="nft" component={NftScreen} />
			</HomeStack.Group>
		</HomeStack.Navigator>
	)
}

export default HomeNavigator
