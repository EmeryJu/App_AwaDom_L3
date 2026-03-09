import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, db } from "../services/firebase";
import { addDoc, collection } from "firebase/firestore";

const BookingConfirmationScreen = ({ route, navigation }: any) => {
  const { helper } = route.params;
  const user = auth.currentUser;

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const confirmBooking = async () => {
    if (!date || !startTime || !endTime) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (!user) return;

    try {
      await addDoc(collection(db, "bookings"), {
        helperId: helper.id,
        helperName: helper.name,
        helperPhoto: helper.photoUrl,
        clientId: user.uid,
        clientName: user.email,
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: "pending",
        createdAt: new Date(),
      });

      Alert.alert("Succès", "Réservation confirmée !");
      navigation.navigate("HomeClient");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer la réservation");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>Confirmation de réservation</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Aide ménagère :</Text>
        <Text style={styles.value}>{helper.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tarif :</Text>
        <Text style={styles.value}>{helper.price} FCFA/h</Text>
      </View>

      <Text style={styles.sectionTitle}>Date :</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 15/03/2024"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.sectionTitle}>Heure de début :</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 08:00"
        value={startTime}
        onChangeText={setStartTime}
      />

      <Text style={styles.sectionTitle}>Heure de fin :</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 12:00"
        value={endTime}
        onChangeText={setEndTime}
      />

      <View style={styles.buttonContainer}>
        <Button title="Confirmer" onPress={confirmBooking} color="#28a745" />
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
});
