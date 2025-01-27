import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import moment from "moment";
import { IPConfig } from "../config";
import mergeDateAndTime from "../util/mergeTime";

const TimeSlotSelectionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service, user } = route.params;

  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState();

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [availableSlots, setAvailableSlots] = useState({}); // To store available slots for each service

  // Fetch the current server time from the backend
  const fetchServerTime = async () => {
    const response = await fetch(`http://${IPConfig}:5500/api/server/time`);
    const data = await response.json();
    return moment(data.localTimeISO);
  };
  const handleBooking = async (service, timeSlot) => {
    // If the user is not an admin, create an appointment directly
    const appointmentData = {
      UserID: user.UserID,
      ServiceID: service.ServiceID,
      DateSlot: moment(timeSlot.DateSlot).format("YYYY-MM-DD"),
      StartTime: timeSlot.StartTime,
      TimeSlotID: timeSlot.TimeSlotID,
      Status: 1,
      BookedByEmployeeID: null,
    };

    try {
      const response = await fetch(
        `http://${IPConfig}:5500/api/user/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) throw new Error("Failed to book appointment");

      Alert.alert("Thành công", "Đặt lịch thành công!");
      navigation.navigate("Saved", { reload: true }); // Navigate back to the admin bookings screen
    } catch (error) {
      Alert.alert("Lỗi", "Đã có khách hàng đặt vào slot cuối cùng. Xin quý khách thông cảm!");
    }
  };
  const fetchTimeSlots = async () => {
    const serverTime = moment(await fetchServerTime()); // Fetch and set server time
    setCurrentTime(serverTime.toISOString());
    try {
      const response = await fetch(
        `http://${IPConfig}:5500/api/auth/availableSlots?serviceId=${service.ServiceID}`
      );
      if (!response.ok) throw new Error("Failed to fetch time slots");

      const data = await response.json();

      setTimeSlots(data); // Set all time slots

      setAvailableSlots(
        data.reduce((acc, slot) => {
          const dateKey = moment(slot.DateSlot).format("YYYY-MM-DD");
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(slot);
          return acc;
        }, {}) // Group slots by date
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch available time slots for the selected service

  useFocusEffect(
    useCallback(() => {
      fetchTimeSlots();
    }, [])
  );
  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };
  const handleTimeSlotSelection = (slot) => {
    Alert.alert(
      "Xác nhận đặt lịch",
      `Bạn chọn ${service.ServiceName} ngày ${moment(slot.DateSlot).format(
        "DD/MM/YYYY"
      )} lúc ${moment(slot.StartTime, "HH:mm:ss").format("HH:mm")}?`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đặt lịch",
          onPress: () => {
            // Proceed with your booking logic here, for example, navigate to the next screen or perform an action.
            handleBooking(service, slot);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render date picker
  const renderDatePicker = () => {
    const days = Array.from({ length: 7 }, (_, i) =>
      moment().add(i, "days").format("YYYY-MM-DD")
    );

    return (
      <FlatList
        data={days}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateCard,
              selectedDate === item && styles.selectedDateCard,
            ]}
            onPress={() => handleDateSelection(item)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === item && styles.selectedDateText,
              ]}
            >
              {moment(item).format("DD MMM")}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePickerContainer}
      />
    );
  };

  // Render time slots for the selected date
  const renderTimeSlotsForSelectedDate = () => {
    const slots = availableSlots[selectedDate] || []; // Get available slots for the selected date
    // Filter available slots for the selected date
    // console.log(slots);

    const filteredSlots = Array.isArray(slots)
      ? slots.filter((slot) => {
          const slotDateTime = mergeDateAndTime(slot.DateSlot, slot.StartTime);
          return slot.IsAvailable >= 1 && slotDateTime > currentTime; // Filter available slots
        })
      : [];
    // console.log(filteredSlots);

    return (
      <View style={styles.serviceCard}>
        {filteredSlots.length > 0 ? (
          <FlatList
            data={filteredSlots}
            keyExtractor={(slot) => `${service.ServiceID}-${slot.TimeSlotID}`}
            renderItem={({ item: slot }) => (
              <TouchableOpacity
                style={[styles.timeSlotButton, styles.availableSlot]}
                onPress={() => {
                  handleTimeSlotSelection(slot);
                }}
              >
                <View>
                  <Text style={styles.timeSlotButtonText}>
                    {moment(slot.StartTime, "HH:mm:ss").format("HH:mm")}
                  </Text>
                  <Text style={styles.slotText}>
                    {`Còn trống: ${slot.IsAvailable}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            vertical
          />
        ) : (
          <Text style={styles.noSlotsText}>Hiện không còn giường trống.</Text>
        )}
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#007bff" />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.datePickerSection}>
        <Text style={styles.sectionHeaderText}>Chọn ngày</Text>
        {renderDatePicker()}
      </View>

      <View style={styles.timeSlotSection}>
        <Text style={styles.sectionHeaderText}>Chọn khung giờ</Text>
        {renderTimeSlotsForSelectedDate()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  datePickerSection: {
    marginBottom: 10,
  },
  timeSlotSection: {
    flex: 1,
  },
  datePickerContainer: {},
  dateCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: 80,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedDateCard: {
    backgroundColor: "#007bff",
  },
  dateText: {
    color: "#000",
    fontSize: 14,
  },
  selectedDateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  serviceCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
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
    marginBottom: 12,
  },
  timeSlotHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginVertical: 8,
  },
  timeSlotButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  availableSlot: {
    backgroundColor: "#007bff", // Green for available slots
  },
  timeSlotButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  slotText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  noSlotsText: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
  },
});

export default TimeSlotSelectionScreen;
