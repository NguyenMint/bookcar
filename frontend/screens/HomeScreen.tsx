import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  BottomTabParamList,
  HomeScreenNavigationProp,
  HomeScreenRouteProp,
} from "../../types/route";

// Define navigation and route types

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Access navigation
  const route = useRoute<HomeScreenRouteProp>(); // Access route

  // Set dynamic header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Trang chủ",
      headerTitleStyle: styles.headerTitle,
      headerStyle: styles.header,
      headerRight: () => (
        <Ionicons
          name="notifications-outline"
          size={24}
          color="black"
          style={styles.headerIcon}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
    </View>
  );
};

export default HomeScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#E8E8E8",
    height: 110,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  headerIcon: {
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
