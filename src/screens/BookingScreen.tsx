import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BookingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réservation</Text>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
