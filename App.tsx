import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import StackNavigator from "./frontend/navigation/StackNavigator";

export default function App() {
  return <StackNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
