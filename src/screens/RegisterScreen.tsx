import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"client" | "aide">("client");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState("");
  const [price, setPrice] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }

    if (type === "aide" && (!city || !skills || !price)) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs pour l'aide ménagère");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      const userData: any = {
        name,
        email,
        phone,
        type,
        createdAt: new Date(),
      };

      if (type === "aide") {
        userData.city = city;
        userData.skills = skills;
        userData.price = price;
        userData.photoUrl = photoUrl || "https://via.placeholder.com/100";
      }

      await setDoc(doc(db, "users", user.uid), userData);

      Alert.alert("Succès", "Compte créé avec succès");

      if (type === "client") {
        navigation.navigate("HomeClient");
      } else {
        navigation.navigate("AideDashboard");
      }
    } catch (error: any) {
      Alert.alert("Erreur Firebase", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>Awa Dom</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Inscription</Text>

        <TextInput
          placeholder="Nom"
          style={styles.input}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Téléphone"
          style={styles.input}
          onChangeText={setPhone}
        />

        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />

        {type === "aide" && (
          <>
            <TextInput
              placeholder="Ville"
              style={styles.input}
              onChangeText={setCity}
            />
            <TextInput
              placeholder="Compétences (ex: Ménage, Cuisine, Repassage)"
              style={styles.input}
              onChangeText={setSkills}
            />
            <TextInput
              placeholder="Tarif horaire (FCFA)"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={setPrice}
            />
            <TextInput
              placeholder="URL Photo (optionnel)"
              style={styles.input}
              onChangeText={setPhotoUrl}
            />
          </>
        )}

        <Text style={styles.label}>Type de compte :</Text>

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "client" && styles.selected,
            ]}
            onPress={() => setType("client")}
          >
            <Text>Client</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "aide" && styles.selected,
            ]}
            onPress={() => setType("aide")}
          >
            <Text>Aide ménagère</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={{ color: "white" }}>Créer le compte</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ marginTop: 15 }}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 50,
  },
  formContainer: {
    width: "100%",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  label: { marginTop: 10, marginBottom: 5 },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#cde1ff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});
