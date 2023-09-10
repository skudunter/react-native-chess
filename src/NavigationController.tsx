import GamePage from "./pages/GamePage"; //the main gameScreen component that will be rendered
import HomePage from "./pages/HomePage"; // the main login screen component that will be rendered
import LeaderBoardPage from "./pages/LeaderBoardPage"; // the main leaderboard screen component that will be rendered
import RegisterUserPage from "./pages/RegisterUserPage"; // the main register screen component that will be rendered
import LogUserInPage from "./pages/LogUserInPage";
import { PRIMARYCOLOR, SECONDARYCOLOR } from "./constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator(); //the main Tab navigator used for the home, game and leaderboard pages

const Stack = createNativeStackNavigator(); //the main Stack navigator used for login and register pages

export function TabNavigationController() {
  //to be displayed when logged in
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;
            if (route.name === "HomePage") {
              iconName = focused ? "body" : "body-outline";
            } else if (route.name === "GamePage") {
              iconName = focused
                ? "game-controller"
                : "game-controller-outline";
            } else if (route.name === "LeaderBoardPage") {
              iconName = focused ? "trophy" : "trophy-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                onPress={() => {
                  navigation.navigate(route.name);
                }}
              />
            );
          },
          tabBarActiveTintColor: SECONDARYCOLOR,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: PRIMARYCOLOR,
            borderTopColor: PRIMARYCOLOR,
          },
        })}
      >
        <Tab.Screen
          component={HomePage}
          name="HomePage"
          options={{ headerShown: false, title: "Home" }}
        />
        <Tab.Screen
          component={GamePage}
          name="GamePage"
          options={{ headerShown: false, title: "Chess" }}
        />
        <Tab.Screen
          component={LeaderBoardPage}
          name="LeaderBoardPage"
          options={{ headerShown: false, title: "Rank" }}
        />
      </Tab.Navigator>
    </>
  );
}

export function StackNavigationController(props: any) {
  //to be displayed when not logged in
  //controls the login and register pages
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginUserPage"
        component={LogUserInPage}
        options={{ headerShown: false,title:'Login' }}
      />
      <Stack.Screen
        name="RegisterUserPage"
        component={RegisterUserPage}
        options={{ headerShown: false,title:'Register'  }}
      />
    </Stack.Navigator>
  );
}
