import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";

import { auth, db } from "../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

const AideDashboardScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("helperId", "==", user.uid)
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

  const updateStatus = async (
    id: string,
    status: string
  ) => {
    await updateDoc(doc(db, "bookings", id), {
      status,
    });
  };

  const statusText = (status: string) => {
    if (status === "accepted") return "Acceptée";
    if (status === "rejected") return "Refusée";
    return "En attente";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>
        Mes demandes
      </Text>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("HelperProfile")}
      >
        <Text style={styles.profileButtonText}>Mon Profil</Text>
      </TouchableOpacity>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.clientName}>
              Client: {item.clientName}
            </Text>
            <Text>Date: {item.date}</Text>
            <Text style={{
              fontWeight: "bold",
              color: item.status === "accepted" ? "green" : item.status === "rejected" ? "red" : "orange"
            }}>
              Statut: {statusText(item.status)}
            </Text>

            {item.status === "pending" && (
              <View style={styles.row}>
                <Button
                  title="Accepter"
                  onPress={() =>
                    updateStatus(item.id, "accepted")
                  }
                />
                <Button
                  title="Refuser"
                  color="red"
                  onPress={() =>
                    updateStatus(item.id, "rejected")
                  }
                />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default AideDashboardScreen;

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
  profileButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  profileButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  clientName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
