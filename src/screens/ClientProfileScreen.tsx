import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ClientProfileScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();

      setName(data.name || "");
      setPhone(data.phone || "");
    }
  };

  const save = async () => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      name,
      phone,
    });

    Alert.alert("Profil mis à jour");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>Mon Profil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
      />

      <Button title="Sauvegarder" onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ClientProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});
