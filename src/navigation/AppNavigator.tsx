import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import PasswordResetScreen from "../screens/PasswordResetScreen";

import HomeClientScreen from "../screens/HomeClientScreen";
import AideDashboardScreen from "../screens/AideDashboardScreen";

import ProfileScreen from "../screens/ProfileScreen";
import ClientProfileScreen from "../screens/ClientProfileScreen";
import HelperProfileScreen from "../screens/HelperProfileScreen";

import HelperDetailsScreen from "../screens/HelperDetailsScreen";
import BookingConfirmationScreen from "../screens/BookingConfirmationScreen";

import ClientBookingsScreen from "../screens/ClientBookingsScreen";


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PasswordReset" 
          component={PasswordResetScreen}
          options={{ title: "Mot de passe oublié" }}
        />

        <Stack.Screen 
          name="HomeClient" 
          component={HomeClientScreen}
          options={{ title: "Accueil" }}
        />
        <Stack.Screen 
          name="AideDashboard" 
          component={AideDashboardScreen}
          options={{ title: "Tableau de bord" }}
        />

        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: "Profil" }}
        />
        <Stack.Screen 
          name="ClientProfile" 
          component={ClientProfileScreen}
          options={{ title: "Mon Profil" }}
        />
        <Stack.Screen 
          name="HelperProfile" 
          component={HelperProfileScreen}
          options={{ title: "Mon Profil Pro" }}
        />

        <Stack.Screen
          name="HelperDetails"
          component={HelperDetailsScreen}
          options={{ title: "Détails" }}
        />

        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmationScreen}
          options={{ title: "Confirmation" }}
        />

        <Stack.Screen
          name="ClientBookings"
          component={ClientBookingsScreen}
          options={{ title: "Mes réservations" }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
