import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
// import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    backgroundColor: "#eee",
    marginVertical: 5,
  },
  container: {
    height: 800,
    borderWidth: 1,
    backgroundColor: "#eee",
  },
});
const HomeScreen = () => {
  const [fromText, setFromText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        value={fromText}
        onChangeText={setFromText}
        style={styles.textInput}
        placeholder="From"
      />
      <TextInput
        value={destinationText}
        onChangeText={setDestinationText}
        style={styles.textInput}
        placeholder="Where to?"
      />
      {/* <GooglePlacesAutocomplete
        // nearbyPlacesAPI="GooglePlacesSearch"
        // enablePoweredByContainer={false}
        placeholder="Search"
        // minLength={2}
        // returnKeyType="search"
        // fetchDetails={true}
        onPress={(data: GooglePlaceData, details:GooglePlaceDetail | null = null) => 
            // onChangeInput(data, details)
            console.log(data, details)
        }
        query={{
          key: 'AIzaSyC6LHcha0T_Z6Q4aO95Uz76aWf4qkG43Hc',
          language: 'en',
        }}
        // debounce={400}
      /> */}
    </View>
  );
};

export default HomeScreen;
