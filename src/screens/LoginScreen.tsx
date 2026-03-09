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
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Email et mot de passe requis");
      return;
    }

    try {
      console.log("Tentative de connexion avec:", email);
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;
      console.log("Utilisateur connecté:", user.uid);

      const docSnap = await getDoc(doc(db, "users", user.uid));
      console.log("Document existe?", docSnap.exists());

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("Type utilisateur:", userData.type);

        if (userData.type === "client") {
          navigation.navigate("HomeClient");
        } else {
          navigation.navigate("AideDashboard");
        }
      } else {
        Alert.alert(
          "Erreur",
          "Profil utilisateur introuvable. Veuillez vous réinscrire."
        );
      }
    } catch (error: any) {
      console.log("Erreur complète:", error);
      console.log("Code erreur:", error.code);
      console.log("Message:", error.message);
      
      let errorMessage = "Erreur de connexion";
      
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "Aucun compte avec cet email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Mot de passe incorrect";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format d'email invalide";
      } else {
        errorMessage = `${error.code}: ${error.message}`;
      }
      
      Alert.alert("Erreur", errorMessage);
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
          <Text style={styles.title}>Connexion</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Mot de passe"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={{ color: "white" }}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ marginTop: 15 }}>Créer un compte</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("PasswordReset")}>
            <Text style={{ marginTop: 10, color: "#007bff" }}>Mot de passe oublié ?</Text>
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
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});
