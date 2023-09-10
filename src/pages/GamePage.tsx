import { View, StyleSheet, Text } from "react-native";
import React from "react";
import Chess from "../Chess/Chess";
import { PRIMARYCOLOR, TERSIARYCOLOR } from "../constants";
import DropDownPicker from "react-native-dropdown-picker";
import auth from "../server";

export default function GamePage(): JSX.Element {
  const [player1Name, setPlayer1Name] = React.useState<string>(
    auth.currentUser?.displayName as string
  );
  const [player2Name, setPlayer2Name] = React.useState<string>("Player 2");

  return (
    <View style={styles.container}>
      <Text style={styles.usernames}>{player2Name}</Text>
      <Chess />
      <Text style={styles.usernames}>{player1Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARYCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  usernames: {
    color: TERSIARYCOLOR,
    fontSize: 20,
    alignSelf:'baseline',
    padding:10
  },
});
