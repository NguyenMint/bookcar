import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

// HomeScreen Component
const HomeScreen = () => {
  const navigation = useNavigation();  // Access the navigation object
  const route = useRoute();  // Access the route params

  // Extract 'user' from route params (fallback to an empty object if not found)
  const { user } = route.params || {};

  // Dynamically set navigation options (header title and right icon)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true, // 
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
     
      <Text style={styles.welcomeText}>
        Welcome, {user ? user.FullName : "User"}!
      </Text>
    </View>
  );
};

export default HomeScreen; 

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 16, 
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
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
