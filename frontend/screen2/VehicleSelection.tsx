// VehicleSelection.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/route";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { trips } from "../../sampledata/tripsData";
type VehicleSelectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "VehicleSelection"
>;
const VehicleSelection = () => {
  const navigation = useNavigation<VehicleSelectionNavigationProp>();
  const route = useRoute();
  const { departure, destination, date, isRoundTrip } = route.params as {
    departure: string;
    destination: string;
    date: string;
    isRoundTrip: boolean;
  };
  const availableVehicles = Array.from(
    new Set(
      trips
        .filter(
          (trip) =>
            trip.origin === departure &&
            trip.destination === destination &&
            trip.date === date
        )
        .map((trip) => trip.vehicleType)
    )
  );
  const handleSelectVehicle = (vehicleType: string) => {
    navigation.navigate("TripList", {
      vehicleType,
      departure,
      destination,
      date,
      isRoundTrip,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Vehicle Type</Text>
      {availableVehicles.length > 0 ? (
        <FlatList
          data={availableVehicles}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSelectVehicle(item)}
            >
              <Text style={styles.buttonText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noVehicles}>
          No vehicles available for the selected trip options.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  vehicleText: {
    fontSize: 16,
    color: "#333",
  },
  noVehicles: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
  vehicleButton: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default VehicleSelection;
