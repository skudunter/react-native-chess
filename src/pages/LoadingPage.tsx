import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PRIMARYCOLOR, SECONDARYCOLOR } from "../constants";

export default function LoadingPage() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={SECONDARYCOLOR} size="large"></ActivityIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARYCOLOR,
  },
});
