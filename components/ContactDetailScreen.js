import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";

import { colors, spacing } from "../style/Theme";
import DefaultImage from "../style/Profile.jpg";

export default function ContactDetailScreen({ route, navigation }) {
  const { contactData, deleteContact, updateContact } = route.params;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const updateRecentContacts = async () => {
      try {
        const storedRecents = await AsyncStorage.getItem("recentContacts");
        let parsedRecents = storedRecents ? JSON.parse(storedRecents) : [];

        parsedRecents = parsedRecents.filter(
          (item) => item.id !== contactData.id
        );

        parsedRecents.unshift(contactData);

        if (parsedRecents.length > 15) {
          parsedRecents.slice(0, 15);
        }
        await AsyncStorage.setItem(
          "recentContacts",
          JSON.stringify(parsedRecents)
        );
      } catch (error) {
        console.log(error);
      }
    };
    updateRecentContacts();
  }, [contactData]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        const parsedFavorites = storedFavorites
          ? JSON.parse(storedFavorites)
          : [];
        const favorited = parsedFavorites.some(
          (item) => item.id === contactData.id
        );
        setIsFavorite(favorited);
      } catch (error) {
        console.log(error);
      }
    };
    checkIfFavorite();
  }, [contactData]);

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      let parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        parsedFavorites = parsedFavorites.filter(
          (item) => item.id !== contactData.id
        );
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(parsedFavorites)
        );
        setIsFavorite(false);
        Alert.alert("Removed", `${contactData.name} removed from favorites`);
      } else {
        // Favorilere ekle
        parsedFavorites.push(contactData);
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(parsedFavorites)
        );
        setIsFavorite(true);
        Alert.alert("Added", `${contactData.name} added to favorites`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Contact",
      "Are you sure delete this contact?",
      [
        {
          text: "No",
          onPress: () => navigation.goBack(),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            deleteContact(contactData.id), navigation.goBack();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={myStyles.container}>
      <Image
        style={myStyles.image}
        source={contactData.image ? { uri: contactData.image } : DefaultImage}
      />
      <Text style={myStyles.name}>{contactData.name}</Text>
      <Text style={myStyles.phone}>{contactData.phone}</Text>

      <View style={myStyles.buttonRow}>
        <TouchableOpacity style={myStyles.deleteButton} onPress={handleDelete}>
          <Text style={myStyles.buttonText}>Delete Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={myStyles.editButton}
          onPress={() =>
            navigation.navigate("EditContactScreen", {
              contact: contactData,
              updateContact: updateContact,
            })
          }
        >
          <Text style={myStyles.buttonText}>Edit Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={myStyles.actionButton}
          onPress={toggleFavorite}
        >
          <Text style={myStyles.buttonText}>
            {isFavorite ? "Unfavorite" : "Favorite"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    alignItems: "center",
    padding: spacing.lg,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.light.accent,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  phone: {
    fontSize: 18,
    color: colors.light.subtleText,
    marginBottom: spacing.lg,
  },
  buttonRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  buttonRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  buttonRowBottom: {
    marginTop: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.light.accent,
    paddingVertical: spacing.md,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: spacing.md,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
