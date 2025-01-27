import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  useRoute,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IPConfig } from "../config";
import mergeDateAndTime from "../util/mergeTime";
import moment from "moment";
import statusMapping from "../util/status";

const SavedScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params || {};
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch server time from API
  const fetchServerTime = async () => {
    try {
      const response = await fetch(`http://${IPConfig}:5500/api/server/time`);
      const data = await response.json();
      return data.localTimeISO;
    } catch (error) {
      console.error("Error fetching server time:", error);
    }
  };

  // Set up header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `Lịch đặt của ${user?.FullName || "User"}`,
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
  }, [navigation, user]);

  // Fetch bookings and update status if overdue
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
          const appointmentTime = moment(
            mergeDateAndTime(booking.DateSlot, booking.StartTime)
          );
          
          // Update status if overdue
          if (
            booking.Status === 1 &&
            currentTime.diff(appointmentTime, "minutes") > 15
          ) {
            try {
              const updateResponse = await fetch(
                `http://${IPConfig}:5500/api/auth/bookings/${booking.AppointmentID}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ Status: 4 }),
                }
              );

              if (!updateResponse.ok) {
                console.error(
                  `Failed to update booking ${booking.AppointmentID}`
                );
              }
            } catch (error) {
              console.error(
                `Error updating booking ${booking.AppointmentID}:`,
                error
              );
            }

            return { ...booking, Status: 4 }; // Update locally
          }

          return booking;
        })
      );
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

  // Render individual booking item
  const renderBookingItem = ({ item }) => {
    const statusInfo = statusMapping[item.Status] || {
      text: "Unknown",
      color: "#000",
    };
    
    return (
      <View style={styles.bookingItem}>
        <Text style={styles.bookingTitle}>{item.ServiceName}</Text>
        <Text style={styles.bookingDate}>
          Ngày: {moment(item.DateSlot).format("DD/MM")} - {item.StartTime}
        </Text>
        <Text style={styles.bookingDetails}>Giá: {item.Price}</Text>
        <Text style={[styles.details]}>
          Trạng thái:{" "}
          <Text style={[styles.details, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.AppointmentID.toString()}
          renderItem={renderBookingItem}
        />
      ) : (
        <Text style={styles.noBookings}>No bookings found</Text>
      )}
    </View>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
  screenHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bookingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookingDate: {
    fontSize: 14,
    color: "#555",
  },
  bookingDetails: {
    fontSize: 14,
    color: "#777",
  },
  noBookings: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 16,
  },
});
