import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

import { auth, db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const ClientBookingsScreen = ({ navigation }: any) => {
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
              <Text style={styles.name}>{item.helperName}</Text>
              <Text>📅 {item.date}</Text>
              {item.startTime && (
                <Text>🕐 {item.startTime} - {item.endTime}</Text>
              )}
              {item.address && (
                <Text style={styles.address}>📍 {item.address}</Text>
              )}
              {item.totalAmount && (
                <Text style={styles.amount}>💰 {item.totalAmount} FCFA</Text>
              )}
              <Text
                style={{
                  color: statusColor(item.status),
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                {statusText(item.status)}
              </Text>

              <View style={styles.buttonRow}>
                {item.location && (
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => {
                      const url = `https://www.google.com/maps?q=${item.location.latitude},${item.location.longitude}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Text style={styles.mapButtonText}>🗺️ Carte</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.receiptButton}
                  onPress={() => navigation.navigate("Receipt", { booking: item })}
                >
                  <Text style={styles.receiptButtonText}>🧾 Reçu</Text>
                </TouchableOpacity>
              </View>
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
    alignItems: "flex-start",
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
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  mapButton: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 5,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  receiptButton: {
    backgroundColor: "#28a745",
    padding: 6,
    borderRadius: 5,
  },
  receiptButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});
