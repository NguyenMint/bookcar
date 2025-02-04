import { useFocusEffect, useRoute, RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IPConfig } from "../config";
import moment from "moment";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileScreenProps } from "../../types/route";

const sampleUser = {
  id: "1",
  name: "User",
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { user } = route.params || { user: sampleUser };
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const fetchServerTime = async (): Promise<string | undefined> => {
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
        `http://${IPConfig}:5500/api/user/bookings?id=${user?.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const currentTime = moment(await fetchServerTime());

      const updatedBookings = await Promise.all(
        data.map(async (booking: any) => booking)
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

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        fetchBookings();
      }
    }, [user])
  );

  const handleLogout = () => {
    Alert.alert("Thoát", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        onPress: () => navigation.replace("Login"),
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.headerText}>
        Thông tin {user?.Role === 1 ? "Nhân viên" : "Khách hàng"}
      </Text> */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tên:</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>email:</Text>
        {/* <Text style={styles.value}>{user.email || "(Không có)"}</Text> */}
      </View>

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
