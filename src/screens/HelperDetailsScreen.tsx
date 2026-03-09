import React from "react";
import { View, Text, StyleSheet, Button, Image, ScrollView } from "react-native";
import { auth } from "../services/firebase";

const HelperDetailsScreen = ({ route, navigation }: any) => {
  const { helper } = route.params;
  const user = auth.currentUser;

  const book = async () => {
    if (!user) return;
    navigation.navigate("BookingConfirmation", { helper });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.logo}>Awa Dom</Text>
      
      <Image
        source={{ uri: helper.photoUrl || "https://via.placeholder.com/150" }}
        style={styles.photo}
      />

      <Text style={styles.title}>{helper.name}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>📍 Ville:</Text>
        <Text style={styles.value}>{helper.city}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>✨ Compétences:</Text>
        <Text style={styles.value}>{helper.skills}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>💵 Tarif:</Text>
        <Text style={styles.value}>{helper.price} FCFA/h</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>📞 Téléphone:</Text>
        <Text style={styles.value}>{helper.phone}</Text>
      </View>

      {helper.availability && (
        <View style={styles.infoCard}>
          <Text style={styles.label}>🕐 Disponibilité:</Text>
          <Text style={styles.value}>{helper.availability}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Réserver" onPress={book} color="#007bff" />
      </View>
    </ScrollView>
  );
};

export default HelperDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20 },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
});
