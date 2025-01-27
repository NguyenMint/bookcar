import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";
import RoundButton from "../components/RoundButton";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView showsUserLocation showsMyLocationButton style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
