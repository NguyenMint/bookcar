// TripList.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { TripListRouteProp } from "../../types/route";
import { Picker } from "@react-native-picker/picker";
import { trips } from "../../sampledata/tripsData";


const TripItem = ({ trip }: { trip: (typeof trips)[0] }) => {
  return (
    <View style={styles.tripItem}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{trip.time}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{trip.company}</Text>
          <View style={styles.rating}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text>{trip.rating}</Text>
          </View>
        </View>
        <View style={styles.extras}>
          {trip.extras.map((extra, index) => (
            <Text key={index} style={styles.extraText}>
              {extra}
            </Text>
          ))}
        </View>
        <Text style={styles.discountText}>Chiết khấu ~{trip.discount}đ</Text>
      </View>
    </View>
  );
};

const TripList = () => {
  const [selectedDate, setSelectedDate] = useState<string>("02/03/2021");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("Hà Nội");
  const [selectedDestination, setSelectedDestination] =
    useState<string>("Nghệ An");
  const route = useRoute<TripListRouteProp>(); // Use the route prop type
  // const { vehicleType } = route.params; // Get the selected vehicle type

  const { vehicleType, departure, destination, date, isRoundTrip } =
    route.params as {
      vehicleType: string;
      departure: string;
      destination: string;
      date: string;
      isRoundTrip: boolean;
    };
  // Filter trips based on selected date, origin, destination, and vehicle type
  const filteredTrips = trips.filter(
    (trip) =>
      trip.vehicleType === vehicleType &&
      trip.origin === departure &&
      trip.destination === destination &&
      trip.date === date
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Trips from {departure} to {destination} on {date}
      </Text>
      {filteredTrips.length > 0 ? (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TripItem trip={item} />}
          style={styles.tripList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No trips available for the selected criteria.
            </Text>
          }
        />
      ) : (
        <Text style={styles.noTrips}>
          No trips available for the trips from {departure} to {destination} on{" "}
          {date}.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  dateSelector: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noTrips: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  dateButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },
  selectedDateButton: {
    backgroundColor: "#007bff",
  },
  dateText: {
    color: "#333",
  },
  selectedDateText: {
    color: "#fff",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  picker: {
    flex: 1,
  },
  tripList: {
    flex: 1,
  },
  tripItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  timeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  detailsContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  extras: {
    flexDirection: "row",
    marginTop: 5,
  },
  extraText: {
    fontSize: 12,
    marginRight: 5,
    color: "#666",
  },
  discountText: {
    color: "red",
    fontWeight: "bold",
    marginTop: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#666",
  },
});

export default TripList;
