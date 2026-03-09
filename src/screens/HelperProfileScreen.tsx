import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function HelperProfileScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState("");
  const [price, setPrice] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [availability, setAvailability] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;

    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      setName(data.name || "");
      setPhone(data.phone || "");
      setCity(data.city || "");
      setSkills(data.skills || "");
      setPrice(data.price || "");
      setPhotoUrl(data.photoUrl || "");
      setAvailability(data.availability || "");
    }
  };

  const handleUpdate = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        phone,
        city,
        skills,
        price,
        photoUrl,
        availability,
      });

      Alert.alert("Succès", "Profil mis à jour");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>Mon Profil Professionnel</Text>

      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.photo} />
      ) : null}

      <TextInput
        placeholder="Nom"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Téléphone"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Ville"
        style={styles.input}
        value={city}
        onChangeText={setCity}
      />

      <TextInput
        placeholder="Compétences (ex: Ménage, Cuisine)"
        style={styles.input}
        value={skills}
        onChangeText={setSkills}
      />

      <TextInput
        placeholder="Tarif horaire (FCFA)"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="URL Photo"
        style={styles.input}
        value={photoUrl}
        onChangeText={setPhotoUrl}
      />

      <TextInput
        placeholder="Disponibilité (ex: Lun-Ven 8h-17h)"
        style={styles.input}
        value={availability}
        onChangeText={setAvailability}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={{ color: "white" }}>Mettre à jour</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          auth.signOut();
          navigation.navigate("Login");
        }}
      >
        <Text style={{ color: "white" }}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
});
