import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { IPConfig } from "../config";
import moment from "moment";
import mergeDateAndTime from "../util/mergeTime";
import Ionicons from "@expo/vector-icons/Ionicons";

const BookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params || {}; // User info passed from route parameters

  // State variables
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Danh sách dịch vụ",
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
  // Fetch services when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `http://${IPConfig}:5500/api/auth/service`
        );
        if (!response.ok) throw new Error("Failed to fetch services");

        const data = await response.json();
        setServices(data.solution); // Set available services
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchServices();
  }, []);

  // Render each service item in the list
  const renderServiceItem = ({ item }) => {
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(item.Price);
    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() =>
          navigation.navigate("TimeSlotSelection", { service: item, user })
        } // Navigate to TimeSlotSelectionScreen
      >
        <Text style={styles.serviceName}>{item.ServiceName}</Text>
        <Text style={styles.servicePrice}>Giá: {formattedPrice}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#007bff" />; // Show loading indicator while data is being fetched
  if (error) return <Text>Error: {error}</Text>; // Show error message if there's an issue with fetching data

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.ServiceID.toString()}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    paddingBottom: 30,
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 8,
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
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    fontWeight: "500",
    textAlign: "center", // Center-align the text
  },
});

export default BookingScreen;
