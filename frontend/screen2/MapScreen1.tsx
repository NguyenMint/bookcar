import {
  Button,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#000",
    borderRadius: 10,
  },
  timeDisplay: {
    marginVertical: 20,
    fontSize: 16,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#075985",
  },
  pickerButton: {
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});

// const MapScreen = ({ navigation }: { navigation: any }) =>{
const MapScreen = () => {
  const [destination, setDestination] = useState<string>("");
  const [depart, setDepart] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [dateString, setDateString] = useState("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const onChange = ({ type }: any, selectedDate?: Date) => {
    // showPicker();
    // setShowDatePicker(Platform.OS === "ios");
    if (type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (Platform.OS === "android") {
        showPicker();
        setDateString(formatDate(date));
      }
    } else {
      showPicker();
    }
  };

  const showPicker = () => {
    //toggle
    setShowDatePicker(!showDatePicker);
  };
  const confirmIOSDate = () => {
    showPicker();
    setDateString(formatDate(date));
  };
  const formatDate = (rawDate: Date) => {
    let date = new Date(rawDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return `${day} - ${month} - ${year}`;
  };
  const handleFind = () => {
    console.log(
      `Searching for rides to ${destination} from ${depart} when ${formatDate(date)} at ${date.toLocaleTimeString()}`
    );
    //   navigation.navigate('RideResults', { destination, depart, date });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nơi xuất phát:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter destination"
        value={destination}
        onChangeText={setDestination}
      />

      <Text style={styles.label}>Bạn muốn đi đâu?:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter departure location"
        value={depart}
        onChangeText={setDepart}
      />

      <Text style={styles.label}>Ngày đi:</Text>
      {/* <Button onPress={showDatepicker} title="Select Time" />*/}
      {showDatePicker && (
        <DateTimePicker
          minimumDate={new Date()}
          value={date}
          mode="date"
          display="spinner"
          onChange={onChange}
          style={styles.datePicker}
        />
      )}
      {showDatePicker && Platform.OS === "ios" && (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.pickerButton,
              { backgroundColor: "#11182711" },
            ]}
            onPress={showPicker}
          >
            <Text style={[styles.buttonText, { color: "#075985" }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.pickerButton]}
            onPress={confirmIOSDate}
          >
            <Text style={[styles.buttonText]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showDatePicker && (
        <Pressable onPress={showPicker}>
          <TextInput
            style={styles.input}
            placeholder={formatDate(new Date())}
            value={dateString}
            editable={false}
            onPressIn={showPicker}
          />
        </Pressable>
      )}

      <Button title="Find" onPress={handleFind} />
    </View>
  );
};
export default MapScreen;
