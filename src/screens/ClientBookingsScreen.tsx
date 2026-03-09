import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";

import { auth, db } from "../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const ClientBookingsScreen = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("clientId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setBookings(list);
    });

    return () => unsubscribe();
  }, []);

  const statusColor = (status: string) => {
    if (status === "accepted") return "green";
    if (status === "rejected") return "red";
    return "orange";
  };

  const statusText = (status: string) => {
    if (status === "accepted") return "Acceptée";
    if (status === "rejected") return "Refusée";
    return "En attente";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>Mes réservations</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.helperPhoto }}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.helperName}
              </Text>
              <Text>Date : {item.date}</Text>
              <Text
                style={{
                  color: statusColor(item.status),
                  fontWeight: "bold",
                }}
              >
                {statusText(item.status)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ClientBookingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
