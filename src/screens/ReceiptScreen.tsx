import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";

const ReceiptScreen = ({ route, navigation }: any) => {
  const { booking } = route.params;

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shareReceipt = async () => {
    const receiptText = `
━━━━━━━━━━━━━━━━━━━━━━
    AWA DOM - REÇU
━━━━━━━━━━━━━━━━━━━━━━

Reçu N°: ${booking.id.substring(0, 8).toUpperCase()}
Date d'émission: ${formatDate()}

━━━━━━━━━━━━━━━━━━━━━━
DÉTAILS DE LA RÉSERVATION
━━━━━━━━━━━━━━━━━━━━━━

Aide ménagère: ${booking.helperName}
Date du service: ${booking.date}
Horaire: ${booking.startTime} - ${booking.endTime}
Durée: ${booking.hours}h
Adresse: ${booking.address || "Non spécifiée"}

━━━━━━━━━━━━━━━━━━━━━━
DÉTAILS DU PAIEMENT
━━━━━━━━━━━━━━━━━━━━━━

Service (${booking.hours}h × ${booking.pricePerHour} FCFA)
${booking.serviceAmount} FCFA

Frais de service
${booking.serviceFee} FCFA

━━━━━━━━━━━━━━━━━━━━━━
TOTAL PAYÉ: ${booking.totalAmount} FCFA
━━━━━━━━━━━━━━━━━━━━━━

Mode de paiement: ${booking.paymentMethod === "wave" ? "Wave" : "Orange Money"}
Statut: ${booking.paymentStatus === "completed" ? "Payé" : "En attente"}

━━━━━━━━━━━━━━━━━━━━━━
Merci d'avoir utilisé AWA DOM
━━━━━━━━━━━━━━━━━━━━━━
    `;

    try {
      await Share.share({
        message: receiptText,
      });
    } catch (error) {
      Alert.alert("Erreur", "Impossible de partager le reçu");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>AWA DOM</Text>
        <Text style={styles.receiptTitle}>REÇU DE PAIEMENT</Text>
        <Text style={styles.receiptNumber}>
          N° {booking.id.substring(0, 8).toUpperCase()}
        </Text>
        <Text style={styles.date}>{formatDate()}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails de la réservation</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Aide ménagère</Text>
          <Text style={styles.value}>{booking.helperName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date du service</Text>
          <Text style={styles.value}>{booking.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Horaire</Text>
          <Text style={styles.value}>
            {booking.startTime} - {booking.endTime}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Durée</Text>
          <Text style={styles.value}>{booking.hours}h</Text>
        </View>

        {booking.address && (
          <View style={styles.row}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={styles.value}>{booking.address}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails du paiement</Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            Service ({booking.hours}h × {booking.pricePerHour} FCFA)
          </Text>
          <Text style={styles.value}>{booking.serviceAmount} FCFA</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Frais de service</Text>
          <Text style={[styles.value, booking.serviceFee === 0 && styles.freeText]}>
            {booking.serviceFee === 0 ? "GRATUIT" : `${booking.serviceFee} FCFA`}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL PAYÉ</Text>
          <Text style={styles.totalValue}>{booking.totalAmount} FCFA</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations de paiement</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Mode de paiement</Text>
          <Text style={styles.value}>
            {booking.paymentMethod === "wave" ? "💳 Wave" : "🟠 Orange Money"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Statut du paiement</Text>
          <Text
            style={[
              styles.value,
              styles.statusBadge,
              booking.paymentStatus === "completed"
                ? styles.statusCompleted
                : styles.statusPending,
            ]}
          >
            {booking.paymentStatus === "completed" ? "✓ Payé" : "⏳ En attente"}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Statut de la réservation</Text>
          <Text
            style={[
              styles.value,
              styles.statusBadge,
              booking.status === "accepted"
                ? styles.statusCompleted
                : booking.status === "rejected"
                ? styles.statusRejected
                : styles.statusPending,
            ]}
          >
            {booking.status === "accepted"
              ? "✓ Acceptée"
              : booking.status === "rejected"
              ? "✗ Refusée"
              : "⏳ En attente"}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Merci d'avoir utilisé AWA DOM
        </Text>
        <Text style={styles.footerSubtext}>
          Pour toute question, contactez-nous
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={shareReceipt}>
          <Text style={styles.shareButtonText}>📤 Partager le reçu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 20,
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  receiptNumber: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#e0e0e0",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: "hidden",
  },
  statusCompleted: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  statusPending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  statusRejected: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  freeText: {
    color: "#28a745",
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#666",
  },
  buttonContainer: {
    padding: 20,
  },
  shareButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#6c757d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
