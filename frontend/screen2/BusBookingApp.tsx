import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { BusBookingAppNavigationProp } from "../../types/route";
import { PROVINCES } from "../../sampledata/tripsData";

const BusBookingApp = () => {
  const navigation = useNavigation<BusBookingAppNavigationProp>();

  const [departure, setDeparture] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [filteredProvinces, setFilteredProvinces] = useState(PROVINCES);
  const [activeField, setActiveField] = useState<"departure" | "destination">();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Chọn địa điểm",
      headerTitleStyle: styles.headerTitle,
      headerStyle: styles.header,
    });
  }, [navigation]);

  const handleFilter = (text: string, field: "departure" | "destination") => {
    if (field === "departure") setDeparture(text);
    if (field === "destination") setDestination(text);

    const filtered = PROVINCES.filter((province) =>
      province.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProvinces(filtered);
    setActiveField(field);
  };

  const handleSelectProvince = (province: string) => {
    if (activeField === "departure") setDeparture(province);
    if (activeField === "destination") setDestination(province);

    setActiveField(undefined); // Close the dropdown
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSearch = () => {
    if (!departure || !destination || !date) {
      Alert.alert("Lỗi", "Bạn chưa điền đủ thông tin.");
      return;
    }
  
    if (departure === destination) {
      Alert.alert("Lỗi", "Điểm đến và điểm đi không được giống nhau.");
      return;
    }
  
    navigation.navigate("VehicleSelection", {
      departure,
      destination,
      date: date.toLocaleDateString("en-GB"),
      isRoundTrip,
    });
  };
  
  return (
    <View style={styles.container}>
      {/* Departure Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nơi xuất phát</Text>
        <TextInput
          style={styles.input}
          value={departure}
          onChangeText={(text) => handleFilter(text, "departure")}
          placeholder="Enter departure location"
        />
        {activeField === "departure" && (
          <FlatList
            data={filteredProvinces}
            keyExtractor={(item) => item}
            style={styles.dropdown}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectProvince(item)}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Destination Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bạn muốn đi đâu?</Text>
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={(text) => handleFilter(text, "destination")}
          placeholder="Enter destination"
        />
        {activeField === "destination" && (
          <FlatList
            data={filteredProvinces}
            keyExtractor={(item) => item}
            style={styles.dropdown}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectProvince(item)}
              >
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Date and Round Trip */}
      <View style={styles.row}>
        <Text style={styles.label}>Ngày đi</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {date.toLocaleDateString("en-GB")}
          </Text>
        </TouchableOpacity>
        <Switch value={isRoundTrip} onValueChange={setIsRoundTrip} />
        <Text style={styles.label}>Khứ hồi</Text>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 14,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: 16,
    color: "#000",
  },
  searchButton: {
    backgroundColor: "#FBC02D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 15,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default BusBookingApp;
