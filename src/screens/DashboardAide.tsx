import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DashboardAide() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Aide</Text>
      <Text>Bienvenue dans votre espace aide.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
