// Service de paiement pour Wave et Orange Money

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: "wave" | "orange_money";
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "wave",
    name: "Wave",
    icon: "💳",
    type: "wave",
  },
  {
    id: "orange_money",
    name: "Orange Money",
    icon: "🟠",
    type: "orange_money",
  },
];

export const SERVICE_FEE = 500; // Frais de service en FCFA

export const calculateTotal = (pricePerHour: number, hours: number, hasSubscription: boolean = false): number => {
  const serviceAmount = pricePerHour * hours;
  const serviceFee = hasSubscription ? 0 : SERVICE_FEE;
  const total = serviceAmount + serviceFee;
  return total;
};

export const calculateBreakdown = (pricePerHour: number, hours: number, hasSubscription: boolean = false) => {
  const serviceAmount = pricePerHour * hours;
  const serviceFee = hasSubscription ? 0 : SERVICE_FEE;
  const total = serviceAmount + serviceFee;

  return {
    serviceAmount,
    serviceFee,
    total,
    hasSubscription,
  };
};

// Fonction pour initier un paiement Wave
export const initiateWavePayment = async (
  amount: number,
  phoneNumber: string,
  bookingId: string
) => {
  // À implémenter avec l'API Wave
  // Documentation: https://developer.wave.com
  console.log("Paiement Wave initié:", { amount, phoneNumber, bookingId });
  
  // Simulation pour le développement
  return {
    success: true,
    transactionId: `WAVE_${Date.now()}`,
    message: "Paiement Wave initié. Confirmez sur votre téléphone.",
  };
};

// Fonction pour initier un paiement Orange Money
export const initiateOrangeMoneyPayment = async (
  amount: number,
  phoneNumber: string,
  bookingId: string
) => {
  // À implémenter avec l'API Orange Money
  // Documentation: https://developer.orange.com/apis/orange-money-webpay/
  console.log("Paiement Orange Money initié:", { amount, phoneNumber, bookingId });
  
  // Simulation pour le développement
  return {
    success: true,
    transactionId: `OM_${Date.now()}`,
    message: "Paiement Orange Money initié. Composez #144# pour confirmer.",
  };
};

// Fonction pour vérifier le statut d'un paiement
export const checkPaymentStatus = async (transactionId: string) => {
  // À implémenter avec les APIs respectives
  console.log("Vérification du paiement:", transactionId);
  
  // Simulation
  return {
    status: "completed", // pending, completed, failed
    transactionId,
  };
};
