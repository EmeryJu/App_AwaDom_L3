import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { auth, db } from "../services/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import {
  paymentMethods,
  calculateBreakdown,
  initiateWavePayment,
  initiateOrangeMoneyPayment,
} from "../services/payment";

const PaymentScreen = ({ route, navigation }: any) => {
  const { helper, date, startTime, endTime, hours, address, location } = route.params;
  const user = auth.currentUser;

  const [selectedPayment, setSelectedPayment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const subExpiry = userData.subscriptionExpiry?.toDate();
        
        if (subExpiry && subExpiry > new Date()) {
          setHasSubscription(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const pricePerHour = parseInt(helper.price);
  const totalHours = hours || 4;
  const { serviceAmount, serviceFee, total } = calculateBreakdown(
    pricePerHour,
    totalHours,
    hasSubscription
  );

  const handlePayment = async () => {
    if (!selectedPayment) {
      Alert.alert("Erreur", "Veuillez sélectionner un mode de paiement");
      return;
    }

    if (!phoneNumber) {
      Alert.alert("Erreur", "Veuillez entrer votre numéro de téléphone");
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      // Créer la réservation
      const bookingRef = await addDoc(collection(db, "bookings"), {
        helperId: helper.id,
        helperName: helper.name,
        helperPhoto: helper.photoUrl,
        clientId: user.uid,
        clientName: user.email,
        date: date,
        startTime: startTime,
        endTime: endTime,
        hours: totalHours,
        address: address,
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
        } : null,
        pricePerHour: pricePerHour,
        serviceAmount: serviceAmount,
        serviceFee: serviceFee,
        totalAmount: total,
        paymentMethod: selectedPayment,
        paymentStatus: "pending",
        status: "pending",
        createdAt: new Date(),
      });

      // Initier le paiement
      let paymentResult;
      if (selectedPayment === "wave") {
        paymentResult = await initiateWavePayment(
          total,
          phoneNumber,
          bookingRef.id
        );
      } else {
        paymentResult = await initiateOrangeMoneyPayment(
          total,
          phoneNumber,
          bookingRef.id
        );
      }

      setLoading(false);

      if (paymentResult.success) {
        Alert.alert(
          "Paiement initié",
          paymentResult.message,
          [
            {
              text: "Voir le reçu",
              onPress: () => {
                navigation.navigate("Receipt", {
                  booking: {
                    id: bookingRef.id,
                    helperName: helper.name,
                    helperPhoto: helper.photoUrl,
                    date,
                    startTime,
                    endTime,
                    hours: totalHours,
                    address,
                    location,
                    pricePerHour,
                    serviceAmount,
                    serviceFee,
                    totalAmount: total,
                    paymentMethod: selectedPayment,
                    paymentStatus: "pending",
                    status: "pending",
                  },
                });
              },
            },
            {
              text: "Retour à l'accueil",
              onPress: () => navigation.navigate("HomeClient"),
            },
          ]
        );
      } else {
        Alert.alert("Erreur", "Le paiement a échoué");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Erreur", "Impossible de créer la réservation");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>Paiement</Text>

      {hasSubscription && (
        <View style={styles.subscriptionBanner}>
          <Text style={styles.subscriptionText}>✓ Abonnement actif - Pas de frais de service</Text>
        </View>
      )}

      {!hasSubscription && (
        <TouchableOpacity
          style={styles.subscriptionPromo}
          onPress={() => navigation.navigate("Subscription")}
        >
          <Text style={styles.promoTitle}>🎉 Économisez avec l'abonnement !</Text>
          <Text style={styles.promoText}>
            5000 FCFA/mois pour des réservations illimitées sans frais
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>Aide ménagère :</Text>
        <Text style={styles.value}>{helper.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Date :</Text>
        <Text style={styles.value}>{date}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Horaire :</Text>
        <Text style={styles.value}>
          {startTime} - {endTime}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Adresse :</Text>
        <Text style={styles.value}>{address}</Text>
        {location && (
          <TouchableOpacity
            style={styles.mapLink}
            onPress={() => {
              const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
              Linking.openURL(url);
            }}
          >
            <Text style={styles.mapLinkText}>🗺️ Voir sur la carte</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Récapitulatif</Text>
        
        <View style={styles.row}>
          <Text style={styles.rowLabel}>
            Service ({totalHours}h × {pricePerHour} FCFA)
          </Text>
          <Text style={styles.rowValue}>{serviceAmount} FCFA</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Frais de service</Text>
          <Text style={[styles.rowValue, hasSubscription && styles.freeText]}>
            {hasSubscription ? "GRATUIT" : `${serviceFee} FCFA`}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total à payer</Text>
          <Text style={styles.totalValue}>{total} FCFA</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mode de paiement :</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentOption,
            selectedPayment === method.id && styles.selectedPayment,
          ]}
          onPress={() => setSelectedPayment(method.id)}
        >
          <Text style={styles.paymentIcon}>{method.icon}</Text>
          <Text style={styles.paymentName}>{method.name}</Text>
          {selectedPayment === method.id && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Numéro de téléphone :</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 77 123 45 67"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Payer {total} FCFA</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.infoText}>
        💡 Vous recevrez une notification pour confirmer le paiement sur votre
        téléphone
      </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: "#666",
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedPayment: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    color: "#007bff",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  subscriptionBanner: {
    backgroundColor: "#d4edda",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  subscriptionText: {
    color: "#155724",
    fontWeight: "bold",
    fontSize: 14,
  },
  subscriptionPromo: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 5,
  },
  promoText: {
    fontSize: 13,
    color: "#856404",
  },
  freeText: {
    color: "#28a745",
    fontWeight: "bold",
  },
  mapLink: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  mapLinkText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});
