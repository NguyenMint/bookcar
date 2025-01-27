import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";
import { IPConfig } from "../config";
import { useNavigation } from "@react-navigation/native";

// SigninScreen component where users can create an account
const SignupScreen = () => {
  const navigation = useNavigation();

  // State variables for form inputs
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(""); // State for email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Placeholder for register button functionality
  const handleNewCustomerBooking = async () => {
    try {
      // Validate inputs
      if (!fullName || !phoneNumber || !username || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const userResponse = await fetch(
        `http://${IPConfig}:5500/api/auth/addUser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Page: "SignUp",
            FullName: fullName,
            PhoneNumber: phoneNumber,
            Email: email, // Pass the email to the API
            Username: username,
            Password: password, // Default password for new customers
          }),
        }
      );

      if (!userResponse.ok) throw new Error("Failed to create new user");

      const userData = await userResponse.json();
      // Optionally, you can handle the user data response here, such as navigating to a new screen
      Alert.alert("Success", "User created successfully");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      {/* Top image section */}
      <View style={styles.topImageContainer}>
        <Image
          source={require("../../assets/spa/topVector.png")}
          style={styles.topImage}
        />
      </View>

      {/* Create account header */}
      <Text style={styles.createAccountText}>Create account</Text>

      {/* User inputs */}
      {[
        {
          icon: <AntDesign name="user" size={24} color="#9A9A9A" />,
          placeholder: "Full Name",
          value: fullName,
          setValue: setFullName,
        },
        {
          icon: <Entypo name="mail" size={24} color="#9A9A9A" />,
          placeholder: "Email (optional)", // Updated placeholder to "Email"
          value: email, // Email state
          setValue: setEmail, // Email state handler
        },
        {
          icon: <Entypo name="mail" size={24} color="#9A9A9A" />,
          placeholder: "Username",
          value: username,
          setValue: setUsername,
        },
        {
          icon: <Fontisto name="locked" size={24} color="#9A9A9A" />,
          placeholder: "Password",
          secure: true,
          value: password,
          setValue: setPassword,
        },
        {
          icon: <AntDesign name="mobile1" size={24} color="#9A9A9A" />,
          placeholder: "Phone Number",
          value: phoneNumber,
          setValue: setPhoneNumber,
        },
      ].map(({ icon, placeholder, secure, value, setValue }, index) => (
        <View style={styles.inputContainer} key={index}>
          <View style={styles.inputIconContainer}>{icon}</View>
          <TextInput
            placeholder={placeholder}
            secureTextEntry={secure}
            style={styles.textInput}
            value={value}
            onChangeText={setValue}
          />
        </View>
      ))}

      {/* Create button */}
      <TouchableOpacity
        style={styles.signInButtonContainer}
        onPress={handleNewCustomerBooking}
      >
        <Text style={styles.signIn}>Create</Text>
        <View style={styles.arrowSignIn}>
          <AntDesign name="arrowright" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

// Styles for the SigninScreen component
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  topImageContainer: {
    alignItems: "center", // Center the top image
  },
  topImage: {
    width: "100%",
    height: 130,
    resizeMode: "cover", // Ensure the image covers the full width
  },
  createAccountText: {
    textAlign: "center",
    fontSize: 24,
    color: "#262626",
    marginVertical: 30, // Increased margin for better spacing
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 30, // Fixed horizontal margin (instead of width * 0.08)
    elevation: 10,
    marginVertical: 15, // Reduced margin between inputs
    alignItems: "center",
    height: 50,
  },
  inputIconContainer: {
    marginLeft: 15, // Added margin left to the icons
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15, // Add padding inside the input field
    fontSize: 16,
    color: "#333333", // Darker color for input text
  },
  forgotPassword: {
    color: "#BEBEBE",
    textAlign: "right",
    width: "90%",
    marginTop: 10, // Add a bit more space between the input and forgot password
  },
  signInButtonContainer: {
    flexDirection: "row",
    marginTop: 40, // Increased margin for better spacing
    width: "80%",
    justifyContent: "flex-end",
    alignSelf: "center", // Center align the button container
  },
  signIn: {
    color: "#262626",
    fontSize: 20,
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
    fontSize: 16,
    marginTop: 15,
  },
  footerContainer: {
    marginTop: 30,
    paddingHorizontal: 30, // Adjusted fixed horizontal padding
  },
  socialMediaContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10, // Added margin for social media section
  },
  socialIcon: {
    backgroundColor: "#FFFFFF",
    elevation: 10,
    margin: 10,
    padding: 12,
    borderRadius: 50,
  },
});
