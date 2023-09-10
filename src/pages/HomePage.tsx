import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  FOURTHCOLOR,
  PRIMARYCOLOR,
  SECONDARYCOLOR,
  TERSIARYCOLOR,
} from "../constants";
import auth, { database, setDataToRealtimeDB } from "../server";
import { get, ref} from "firebase/database";
import EditModal from "../modals/EditModal";

export default function HomePage() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(
    user?.displayName || user?.email || "Anonymous"
  );
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isPfpLoaded, setIsPfpLoaded] = useState(false);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  function handleEditPress() {
    setEditModalVisible(true);
  }

  function handleProfileImageLoad() {
    setIsPfpLoaded(true);
  }

  useEffect(() => {
    get(ref(database, "users/" + user?.uid)).then((snapshot) => {
      if (snapshot.exists()) {
        setWins(snapshot.val().wins);
        setLosses(snapshot.val().losses);
        setGamesPlayed(snapshot.val().games);
      } else {
        //init user in firebase realtime db
        setDataToRealtimeDB(
          user!.uid,
          username,
          Math.round(Math.random() * 10),
          Math.round(Math.random() * 10),
          photoURL
        ).then(() => {
          get(ref(database, "users/" + user?.uid)).then((snapshot) => {
            if (snapshot.exists()) {
              setWins(snapshot.val().wins);
              setLosses(snapshot.val().losses);
              setGamesPlayed(snapshot.val().games);
            }
          });
        });
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[SECONDARYCOLOR, PRIMARYCOLOR]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={styles.gradient}
      >
        <ScrollView>
          <EditModal
            visible={editModalVisible}
            setEditModalVisible={setEditModalVisible}
            username={username}
            setUsername={setUsername}
            photoURL={photoURL}
            setPhotoURL={setPhotoURL}
            setPfpHasLoaded={setIsPfpLoaded}
          />
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              {photoURL === "" ? (
                <MaterialIcons name="account-circle" size={100} color="#FFF" />
              ) : (
                <>
                  {!isPfpLoaded && (
                    <ActivityIndicator size="large" color={TERSIARYCOLOR} />
                  )}
                  <Image
                    source={{ uri: photoURL }}
                    style={[
                      styles.profileImage,
                      { opacity: isPfpLoaded ? 1 : 0 },
                      { width: isPfpLoaded ? 128 : 10 },
                    ]}
                    onLoad={handleProfileImageLoad}
                    onError={() => console.log("error")}
                  />
                </>
              )}
              <View style={styles.profileNameContainer}>
                <Text style={styles.profileName}>{username}</Text>
                <View style={styles.stats}>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{gamesPlayed}</Text>
                    <Text style={styles.statLabel}>Games</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{wins}</Text>
                    <Text style={styles.statLabel}>Wins</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statNumber}>{losses}</Text>
                    <Text style={styles.statLabel}>Losses</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}
            >
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 16,
    marginTop: 32,
    paddingBottom: 32,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  profileNameContainer: {
    marginLeft: 0,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 22,
    marginLeft: 18,
    color: TERSIARYCOLOR,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  stat: {
    alignItems: "center",
    marginLeft: 16,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: TERSIARYCOLOR,
  },
  statLabel: {
    fontSize: 12,
    color: FOURTHCOLOR,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  editButton: {
    backgroundColor: SECONDARYCOLOR,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  btnText: {
    color: TERSIARYCOLOR,
    fontWeight: "bold",
  },
});
