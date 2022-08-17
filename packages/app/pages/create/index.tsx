import { Drop } from "app/components/drop";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { CreateStackParams } from "app/navigation/types";

const CreateStack = createStackNavigator<CreateStackParams>();

function CreateNavigator() {
  return (
    <CreateStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions}
    >
      <CreateStack.Screen name="Drop" component={Drop} />
    </CreateStack.Navigator>
  );
}

export default CreateNavigator;
