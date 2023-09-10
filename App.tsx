import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  TabNavigationController,
  StackNavigationController,
} from "./src/NavigationController";
import { browserLocalPersistence, inMemoryPersistence } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingPage from "./src/pages/LoadingPage";
import auth from "./src/server";
import { OS } from "./src/constants";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, user] = useAuthState(auth);

  useEffect(() => {
    // Set up Firebase Authentication persistence
    auth
      .setPersistence(OS == "ios" ? inMemoryPersistence : browserLocalPersistence)
      .then(() => {
        // console.log("Persistence mode set to local");
      })
      .catch((error) => {
        console.error("Error setting persistence mode:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPage />; // Render a loading indicator or splash screen
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" hidden={false} />

      {loggedIn ? <TabNavigationController /> : <StackNavigationController />}
    </NavigationContainer>
  );
}
