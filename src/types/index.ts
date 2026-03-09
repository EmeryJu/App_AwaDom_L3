// Types pour l'application AWA DOM

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "client" | "aide";
  createdAt: Date;
  
  // Champs spécifiques aux aides ménagères
  city?: string;
  skills?: string;
  price?: string;
  photoUrl?: string;
  availability?: string;
}

export interface Booking {
  id: string;
  helperId: string;
  helperName: string;
  helperPhoto: string;
  clientId: string;
  clientName: string;
  date: string;
  time?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface Helper extends User {
  type: "aide";
  city: string;
  skills: string;
  price: string;
  photoUrl: string;
  availability?: string;
}

export interface Client extends User {
  type: "client";
}

export type UserType = "client" | "aide";
export type BookingStatus = "pending" | "accepted" | "rejected";
