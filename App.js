import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import StackNavigator from "./frontend/navigation/StackNavigator.js";

export default function App() {
  return (
    <>
      <StackNavigator />
      {/* <SigninScreen/> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
