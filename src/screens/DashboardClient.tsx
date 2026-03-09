import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function DashboardClient() {
  const [aides, setAides] = useState<any[]>([]);

  useEffect(() => {
    const fetchAides = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const aidesList: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "aide") {
          aidesList.push({ id: doc.id, ...data });
        }
      });

      setAides(aidesList);
    };

    fetchAides();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des aides</Text>

      <FlatList
        data={aides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Nom: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Téléphone: {item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
});
