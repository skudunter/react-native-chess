import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import { PRIMARYCOLOR, SECONDARYCOLOR, TERSIARYCOLOR } from "../constants";
import { useState } from "react";
import { onValue, ref, set } from "firebase/database";
import auth, { database } from "../server";
import { useAuthState } from "react-firebase-hooks/auth";
import { MaterialIcons } from "@expo/vector-icons";

const entries = [
  {
    username: "Alice",
    pfpUrl: "https://i.imgur.com/UYiroysl.png",
    wins: 100,
    losses: 10,
    gamesPlayed: 20,
  },
  {
    username: "Bob",
    pfpUrl: "https://i.imgur.com/XT2Ynet.png",
    wins: 90,
    losses: 20,
    gamesPlayed: 20,
  },
];

export default function LeaderBoardPage() {
  const [user] = useAuthState(auth);
  const [entries, setEntries] = useState([
    {
      username: "",
      pfpUrl: "",
      wins: 100,
      losses: 10,
      gamesPlayed: 20,
    },
  ]);
  useEffect(() => {
    onValue(ref(database, "users"), (snapshot) => {
      let entriesPlaceholder: any = [];
      const data = snapshot.val();
      entriesPlaceholder = Object.keys(data).map((key) => {
        return {
          username: data[key].username,
          pfpUrl: data[key].pfpUrl,
          wins: data[key].wins,
          losses: data[key].losses,
          gamesPlayed: data[key].games,
        };
      });
      setEntries(entriesPlaceholder);
    });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Leaderboard</Text>
      </View>
      <ScrollView style={styles.entries}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldTitle}>Player</Text>
          <View style={styles.fieldDataContainer}>
            <Text style={styles.fieldDataTitle}>Wins:</Text>
            <Text style={styles.fieldDataTitle}>Losses:</Text>
            <Text style={styles.fieldDataTitle}>Games Played:</Text>
          </View>
        </View>

        {entries.map((entry:any, index:any) => (
          <View style={styles.entry} key={index}>
            <View style={styles.playerInfo}>
              {entry.pfpUrl === "" ? (
                <MaterialIcons name="account-circle" size={24} color="#FFF" />
              ) : (
                <Image
                  source={{ uri: entry.pfpUrl }}
                  style={styles.pfp}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.entryName}>{entry.username}</Text>
            </View>
            <View style={styles.fieldDataContainer}>
              <Text style={styles.entryScore}>{entry.wins}</Text>
              <Text style={styles.entryScore}>{entry.losses}</Text>
              <Text style={styles.entryScore}>{entry.gamesPlayed}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Firebase</Text>
      </View>
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
  header: {
    height: 80,
    width: "100%",
    backgroundColor: PRIMARYCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: TERSIARYCOLOR,
    fontSize: 24,
    fontWeight: "bold",
  },
  entries: {
    flex: 1,
    width: "100%",
    padding: 5,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryName: {
    fontSize: 16,
    fontWeight: "300",
    color: TERSIARYCOLOR,
    marginLeft: 10,
  },
  entryScore: {
    fontSize: 18,
    color: TERSIARYCOLOR,
    fontWeight: "300",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  fieldTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: TERSIARYCOLOR,
  },
  fieldDataContainer: {
    marginLeft: 10,
    alignItems: "flex-start", // Aligns the data titles to the left
  },
  fieldDataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: TERSIARYCOLOR,
  },
  footer: {
    height: 40,
    width: "100%",
    backgroundColor: SECONDARYCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: TERSIARYCOLOR,
    fontSize: 12,
  },
  pfp: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
});
