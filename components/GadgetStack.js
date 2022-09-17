import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { NOTES_SCREEN } from "../constants";
import NotesScreenAdd from "../screens/GadgetScreenAdd";
import NotesScreenHome from "../screens/GadgetScreenHome";
import NotesScreenDetails from "../screens/GadgetScreenDetails";

const NotesStackNav = createStackNavigator();

export default function NotesStack() {
  return (
    <NotesStackNav.Navigator>
      <NotesStackNav.Screen
        name={NOTES_SCREEN.Home}
        component={NotesScreenHome}
        options={{ headerShown: false }}
      />
      <NotesStackNav.Screen
        name={NOTES_SCREEN.Add}
        component={NotesScreenAdd}
        options={{ headerShown: false }}
      />
      <NotesStackNav.Screen
        name={NOTES_SCREEN.Details}
        component={NotesScreenDetails}
        options={{ headerShown: false }}
      />
    </NotesStackNav.Navigator>
  );
}
