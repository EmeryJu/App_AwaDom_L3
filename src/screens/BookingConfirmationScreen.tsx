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
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../services/firebase";
import { addDoc, collection } from "firebase/firestore";
import {
  getCurrentLocation,
  getAddressFromCoords,
  LocationCoords,
} from "../services/location";

const BookingConfirmationScreen = ({ route, navigation }: any) => {
  const { helper } = route.params;
  const user = auth.currentUser;

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getLocation = async () => {
    setLoadingLocation(true);
    const coords = await getCurrentLocation();
    
    if (coords) {
      setLocation(coords);
      const addr = await getAddressFromCoords(coords.latitude, coords.longitude);
      setAddress(addr);
      Alert.alert("Succès", "Localisation récupérée !");
    }
    
    setLoadingLocation(false);
  };

  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  const confirmBooking = () => {
    if (!date || !startTime || !endTime) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (!address) {
      Alert.alert("Erreur", "Veuillez entrer ou récupérer votre adresse");
      return;
    }

    const hours = calculateHours();
    if (hours <= 0) {
      Alert.alert("Erreur", "L'heure de fin doit être après l'heure de début");
      return;
    }

    if (!user) return;

    // Naviguer vers l'écran de paiement
    navigation.navigate("Payment", {
      helper,
      date,
      startTime,
      endTime,
      hours,
      address,
      location,
    });
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

      <Text style={styles.sectionTitle}>Adresse :</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre adresse"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <TouchableOpacity
        style={styles.locationButton}
        onPress={getLocation}
        disabled={loadingLocation}
      >
        {loadingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationButtonText}>
              {location ? "Actualiser ma position" : "Utiliser ma position actuelle"}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {location && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            ✓ Position enregistrée
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Continuer vers le paiement" onPress={confirmBooking} color="#28a745" />
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
  locationButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  locationInfo: {
    backgroundColor: "#d4edda",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  locationText: {
    color: "#155724",
    fontSize: 14,
    textAlign: "center",
  },
});
