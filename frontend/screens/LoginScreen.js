// LoginScreen.js
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useNavigation } from "@react-navigation/native";
import { IPConfig } from "../config";

const LoginScreen = () => {
  const navigation = useNavigation();
  // State variables to hold username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both username and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://" + IPConfig + ":5500/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Lỗi", data.message || "Đăng nhập thất bại!");
        return;
      }
      
      navigation.navigate("Main", { user: data.user });
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Handle navigation to the Register (Signup) screen
  const handleRegister = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image
          source={require("../../assets/spa/topVector.png")}
          style={styles.topImage}
        />
      </View>

      <View style={styles.helloContainer}>
        <Text style={styles.helloText}>Spa Booking</Text>
      </View>

      <View>
        <Text style={styles.signInText}>Sign in to your account</Text>
      </View>

      <View style={styles.inputContainer}>
        <AntDesign
          style={styles.inputIcon}
          name="user"
          size={24}
          color="#9A9A9A"
        />
        <TextInput
          placeholder="Username"
          style={styles.textInput}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="default"
        />
      </View>

      <View style={styles.inputContainer}>
        <Fontisto
          style={styles.inputIcon}
          name="locked"
          size={24}
          color="#9A9A9A"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.signInButtonContainer}
        onPress={handleLogin} // Trigger login function on press
      >
        <Text style={styles.signIn}>Sign in</Text>
        <View style={styles.arrowSignIn}>
          <AntDesign name="arrowright" size={24} color="black" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text style={{ textDecorationLine: "underline" }}>Create</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen; // Export the component

// Styles for the LoginScreen component
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  topImageContainer: {},
  topImage: {
    width: "100%",
    height: 150,
  },
  helloContainer: {},
  helloText: {
    textAlign: "center",
    fontSize: 70,
    fontWeight: "500",
    color: "black",
  },
  signInText: { 
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    alignItems: "center",
    height: 50,
  },
  inputIcon: {
    marginHorizontal: 15,
  },
  textInput: {
    flex: 1,
  },
  forgotPassword: {
    color: "#BEBEBE",
    textAlign: "right",
    width: "90%",
  },
  signInButtonContainer: {
    flexDirection: "row",
    marginTop: 50,
    width: "80%",
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "center",
  },
  signIn: {
    color: "#262626",
    fontSize: 25,
    fontWeight: "bold",
  },
  arrowSignIn: {
    height: 34,
    width: 56,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    marginLeft: 12,
  },
  footerText: {
    color: "#262626",
    textAlign: "center",
    fontSize: 15,
    marginTop: 30,
  },
});
