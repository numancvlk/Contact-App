import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

// ----------------COMPONENTS--------------------
import ContactsScreen from "./components/ContactsScreen";
import ContactDetailScreen from "./components/ContactDetailScreen";
import AddContactScreen from "./components/AddContactScreen";
import EditContactScreen from "./components/EditContactScreen";
import FavoritesScreen from "./components/FavoritesScreen";
import RecentScreen from "./components/RecentScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ContactsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactsScreen"
        component={ContactsScreen}
        options={{ title: "Contacts" }}
      />
      <Stack.Screen
        name="ContactDetailScreen"
        component={ContactDetailScreen}
        options={{ title: "Contact Details" }}
      />
      <Stack.Screen
        name="AddContactScreen"
        component={AddContactScreen}
        options={{ title: "Add Contact" }}
      />
      <Stack.Screen
        name="EditContactScreen"
        component={EditContactScreen}
        options={{ title: "Edit Contact" }}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
    </Stack.Navigator>
  );
}

function RecentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecentScreen"
        component={RecentScreen}
        options={{ title: "Recent" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  const addToFavorites = async (contact) => {
    const updated = [...favorites, contact];
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Contacts") {
              iconName = "people-outline";
            } else if (route.name === "Favorites") {
              iconName = "star-outline";
            } else if (route.name === "Recent") {
              iconName = "call-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Contacts" component={ContactsStack} />
        <Tab.Screen name="Favorites" component={FavoritesStack} />
        <Tab.Screen name="Recent" component={RecentStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
