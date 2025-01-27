import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IPConfig } from "../config";
import moment from "moment";
import mergeDateAndTime from "../util/mergeTime";

const ProfileScreen = ({ navigation }) => {
  const route = useRoute();
  const { user } = route.params || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchServerTime = async () => {
    try {
      const response = await fetch(`http://${IPConfig}:5500/api/server/time`);
      const data = await response.json();
      return data.localTimeISO;
    } catch (error) {
      console.error("Error fetching server time:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://${IPConfig}:5500/api/user/bookings?userId=${user?.UserID}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const currentTime = moment(await fetchServerTime());

      const updatedBookings = await Promise.all(
        data.map(async (booking) => {
          return booking;
        })
      );

      // Calculate the total price for completed bookings
      const completedTotal = updatedBookings
        .filter((booking) => booking.Status === 3)
        .reduce((sum, booking) => sum + (Number(booking.Price) || 0), 0);

      setTotalPrice(completedTotal); // Update total price
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on screen focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.UserID) {
        fetchBookings();
      }
    }, [user])
  );
  // Handle logout action
  const handleLogout = () => {
    Alert.alert("Thoát", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        onPress: () => navigation.replace("Login"), // Navigate to LoginScreen
      },
    ]);
  };

  // If user data is unavailable, show an error message
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        Thông tin {user?.Role === 1 ? "Nhân viên" : "Khách hàng"}{" "}
        {/* Display user role */}
      </Text>

      {/* Display user profile information */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tên:</Text>
        <Text style={styles.value}>{user.FullName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.Email || "(Không có)"}</Text>
      </View>
      {user?.Role === 0 && (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tổng chi phí:</Text>
          <Text style={styles.value}>{totalPrice.toLocaleString()} VND</Text>
        </View>
      )}

      {/* Logout button */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    width: 100,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
