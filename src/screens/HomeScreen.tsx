import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

const HomeScreen = ({ navigation }: any) => {
  const [helpers, setHelpers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHelpers();
  }, []);

  const loadHelpers = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("type", "==", "aide")
      );

      const snap = await getDocs(q);

      const list: any[] = [];

      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setHelpers(list);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = helpers.filter((h) =>
    h.skills?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher une aide</Text>

      <TextInput
        style={styles.search}
        placeholder="Ex: ménage, repassage..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Booking", { helper: item })
            }
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.city}</Text>
            <Text>{item.skills}</Text>
            <Text>{item.price} FCFA / h</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
