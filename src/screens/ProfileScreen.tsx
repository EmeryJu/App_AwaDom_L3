import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const CLOUD_NAME = "dgxahbu75";
const UPLOAD_PRESET = "awa-dom";

const ProfileScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) loadProfile();
  }, []);

  const loadProfile = async () => {
    const snap = await getDoc(doc(db, "users", user!.uid));

    if (snap.exists()) {
      const data = snap.data();
      setName(data.name || "");
      setCity(data.city || "");
      setSkills(data.skills || "");
      setPrice(data.price || "");
      setPhone(data.phone || "");
      setPhoto(data.photoUrl || null);
    }
  };

  const pickImage = async () => {
    const perm =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {
      Alert.alert("Permission refusée");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (): Promise<string | null> => {
    if (!photo) return null;

    const data = new FormData();

    data.append("file", {
      uri: photo,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);

    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    return json.secure_url;
  };

  const saveProfile = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const photoUrl = await uploadToCloudinary();

      await updateDoc(doc(db, "users", user.uid), {
        name,
        city,
        skills,
        price,
        phone,

        photoUrl: photoUrl || photo,
      });

      Alert.alert("Profil mis à jour", "Succès", [
        {
          text: "OK",
          onPress: () => navigation.replace("AideDashboard"),
        },
      ]);
    } catch (err: any) {
      Alert.alert("Erreur", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profil Aide</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri:
              photo ||
              "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.photoText}>
        Modifier la photo
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Ville"
        value={city}
        onChangeText={setCity}
      />

      <TextInput
        style={styles.input}
        placeholder="Compétences"
        value={skills}
        onChangeText={setSkills}
      />

      <TextInput
        style={styles.input}
        placeholder="Tarif FCFA/h"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
  style={styles.input}
  placeholder="Numéro de téléphone"
  keyboardType="phone-pad"
  value={phone}
  onChangeText={setPhone}
/>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Sauvegarder" onPress={saveProfile} />
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 10,
    backgroundColor: "#eee",
  },

  photoText: {
    color: "#1E3A8A",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});
