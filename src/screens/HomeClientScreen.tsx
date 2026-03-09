import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  ScrollView,
} from "react-native";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const HomeClientScreen = ({ navigation }: any) => {
  const [helpers, setHelpers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const list: any[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();

          if (data.type === "aide") {
            list.push({ id: doc.id, ...data });
          }
        });

        setHelpers(list);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = helpers.filter((h) => {
    const matchSkills = h.skills?.toLowerCase().includes(search.toLowerCase());
    const matchCity = !cityFilter || h.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchPrice = !maxPrice || parseInt(h.price) <= parseInt(maxPrice);
    return matchSkills && matchCity && matchPrice;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>Rechercher une aide</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("ClientProfile")}
        >
          <Text style={styles.navButtonText}>Mon Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("ClientBookings")}
        >
          <Text style={styles.navButtonText}>Mes réservations</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Compétence..."
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterButtonText}>
          {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Ville"
            value={cityFilter}
            onChangeText={setCityFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Prix max (FCFA/h)"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("HelperDetails", { helper: item })
            }
          >
            <Image
              source={{
                uri:
                  item.photoUrl ||
                  "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>📍 {item.city}</Text>
              <Text>📞 {item.phone}</Text>
              <Text>✨ {item.skills}</Text>
              <Text style={styles.price}>{item.price} FCFA/h</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeClientScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  search: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  filterButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  filtersContainer: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterInput: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  name: { fontWeight: "bold", fontSize: 17, marginBottom: 4 },
  price: { fontWeight: "bold", color: "#007bff", marginTop: 4 },
});
