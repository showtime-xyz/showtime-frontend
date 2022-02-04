import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

type Props = {
  onPick: (attachment: any) => void;
};

export async function pickImage({ onPick }: Props) {
  if (Platform.OS === "ios") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.cancelled) return;

    const file = { uri: result.uri };

    onPick(file);
  } catch (error) {
    console.error(error);
  }
}
