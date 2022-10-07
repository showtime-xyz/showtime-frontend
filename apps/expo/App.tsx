import { Button, SafeAreaView } from "react-native";

import {
  auth as SpotifyAuth,
  ApiScope,
  ApiConfig,
} from "react-native-spotify-remote";

// Api Config object, replace with your own applications client id and urls
const spotifyConfig: ApiConfig = {
  clientID: "e12f7eea542947ff843cfc68d762235a",
  redirectURL: "io.showtime.development://spotify-success",
  scopes: [ApiScope.UserTopReadScope],
};

const App = () => {
  return (
    <SafeAreaView>
      <Button
        title="Authorise"
        onPress={async () => {
          const session = await SpotifyAuth.authorize(spotifyConfig);
          console.log("session ", session);
        }}
      />
    </SafeAreaView>
  );
};

export default App;
