import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  initiateWavePayment,
  initiateOrangeMoneyPayment,
  paymentMethods,
} from "../services/payment";

const SUBSCRIPTION_PRICE = 5000; // 5000 FCFA/mois

const SubscriptionScreen = ({ navigation }: any) => {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [processing, setProcessing] = useState(false);
  const user = auth.currentUser;

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
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPayment) {
      Alert.alert("Erreur", "Veuillez sélectionner un mode de paiement");
      return;
    }

    if (!user) return;

    Alert.prompt(
      "Numéro de téléphone",
      "Entrez votre numéro pour le paiement",
      async (phoneNumber) => {
        if (!phoneNumber) return;

        setProcessing(true);

        try {
          let paymentResult;
          if (selectedPayment === "wave") {
            paymentResult = await initiateWavePayment(
              SUBSCRIPTION_PRICE,
              phoneNumber,
              `SUB_${user.uid}`
            );
          } else {
            paymentResult = await initiateOrangeMoneyPayment(
              SUBSCRIPTION_PRICE,
              phoneNumber,
              `SUB_${user.uid}`
            );
          }

          if (paymentResult.success) {
            // Activer l'abonnement (30 jours)
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            await updateDoc(doc(db, "users", user.uid), {
              subscriptionExpiry: expiryDate,
              subscriptionActive: true,
            });

            Alert.alert(
              "Succès",
              "Abonnement activé ! Vous bénéficiez de réservations illimitées sans frais pendant 30 jours.",
              [{ text: "OK", onPress: () => navigation.goBack() }]
            );
          }
        } catch (error) {
          Alert.alert("Erreur", "Le paiement a échoué");
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>Awa Dom</Text>
      <Text style={styles.title}>Abonnement Premium</Text>

      {hasSubscription ? (
        <View style={styles.activeCard}>
          <Text style={styles.activeIcon}>✓</Text>
          <Text style={styles.activeTitle}>Abonnement actif</Text>
          <Text style={styles.activeText}>
            Vous bénéficiez de réservations illimitées sans frais de service
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.offerCard}>
            <Text style={styles.price}>{SUBSCRIPTION_PRICE} FCFA</Text>
            <Text style={styles.period}>par mois</Text>

            <View style={styles.divider} />

            <View style={styles.benefit}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>
                Réservations illimitées
              </Text>
            </View>

            <View style={styles.benefit}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>
                Aucun frais de service (économisez 500 FCFA/réservation)
              </Text>
            </View>

            <View style={styles.benefit}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>
                Support prioritaire
              </Text>
            </View>

            <View style={styles.benefit}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>
                Annulation gratuite
              </Text>
            </View>
          </View>

          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>Économisez dès 11 réservations !</Text>
            <Text style={styles.comparisonText}>
              Sans abonnement : 500 FCFA × 11 = 5 500 FCFA
            </Text>
            <Text style={styles.comparisonText}>
              Avec abonnement : 5 000 FCFA (illimité)
            </Text>
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
                <Text style={styles.checkmarkBlue}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, processing && styles.buttonDisabled]}
            onPress={handleSubscribe}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                S'abonner pour {SUBSCRIPTION_PRICE} FCFA/mois
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.skipText}>Continuer sans abonnement</Text>
          </TouchableOpacity>
        </>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  activeCard: {
    backgroundColor: "#d4edda",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  activeIcon: {
    fontSize: 50,
    color: "#28a745",
    marginBottom: 10,
  },
  activeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#155724",
    marginBottom: 10,
  },
  activeText: {
    fontSize: 14,
    color: "#155724",
    textAlign: "center",
  },
  offerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
  },
  period: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 20,
    color: "#28a745",
    marginRight: 10,
  },
  benefitText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  comparisonCard: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 10,
  },
  comparisonText: {
    fontSize: 14,
    color: "#856404",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
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
  checkmarkBlue: {
    fontSize: 20,
    color: "#007bff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
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
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  skipText: {
    color: "#666",
    fontSize: 14,
  },
});
