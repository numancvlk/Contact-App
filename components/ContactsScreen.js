import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
  shadows,
} from "../style/Theme";

export default function ContactsScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [contact, setContact] = useState([]);

  const filteredContacts = searchText
    ? contact.filter((contact) => {
        return contact.name.toLowerCase().includes(searchText.toLowerCase());
      })
    : contact;

  const resetAllStorage = async () => {
    try {
      await AsyncStorage.removeItem("contacts");
      await AsyncStorage.removeItem("favorites");
      await AsyncStorage.removeItem("recentContacts");
      console.log("Tüm veriler başarıyla silindi.");
    } catch (error) {
      console.log("Temizleme hatası:", error);
    }
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem("contacts");
        if (storedContacts !== null) {
          setContact(JSON.parse(storedContacts));
        } else {
          // Artık dummyContacts yok, boş liste ata
          setContact([]);
        }
      } catch (error) {
        console.log("AsyncStorage get error: ", error);
        await AsyncStorage.removeItem("contacts");
        setContact([]);
      }
    };
    loadContacts();
  }, []);

  const addNewContact = async (newContact) => {
    try {
      setContact((prevContact) => {
        const updatedContacts = [...prevContact, newContact];
        AsyncStorage.setItem("contacts", JSON.stringify(updatedContacts));
        return updatedContacts;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeScreen = () => {
    return navigation.navigate("AddContactScreen", {
      addContact: addNewContact,
    });
  };

  const deleteContact = async (id) => {
    const updated = contact.filter((c) => c.id !== id);
    setContact(updated);
    try {
      await AsyncStorage.setItem("contacts", JSON.stringify(updated));
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites !== null) {
        let parsedFavorites = JSON.parse(storedFavorites);
        parsedFavorites = parsedFavorites.filter((item) => item.id !== id);
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(parsedFavorites)
        );
      }
    } catch (err) {
      console.log("Silme sırasında hata oluştu:", err);
    }
  };

  const updateContact = async (updated) => {
    try {
      setContact((prev) => {
        const updatedContacts = prev.map((c) =>
          c.id === updated.id ? updated : c
        );
        AsyncStorage.setItem("contacts", JSON.stringify(updatedContacts));
        return updatedContacts;
      });

      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites !== null) {
        let parsedFavorites = JSON.parse(storedFavorites);
        const updatedFavorites = parsedFavorites.map((fav) =>
          fav.id === updated.id ? updated : fav
        );
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );
      }
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <View style={[myStyles.container, shadows.light]}>
      <TextInput
        inputMode="search"
        placeholder="Search for a person"
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor={colors.light.muted}
        style={myStyles.searchInput}
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(data) => data.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={myStyles.card}
            onPress={() =>
              navigation.navigate("ContactDetailScreen", {
                contactData: item,
                deleteContact: deleteContact,
                updateContact: updateContact,
              })
            }
          >
            <Text style={myStyles.contactName}>{item.name}</Text>
            <Text style={myStyles.contactPhone}>{item.phone}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={myStyles.fab} onPress={changeScreen}>
        <Text style={myStyles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: spacing.md,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    color: colors.light.text,
  },
  card: {
    backgroundColor: colors.light.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.light,
  },
  contactName: {
    fontSize: fontSizes.lg,
    fontWeight: "600",
    color: colors.light.text,
  },
  contactPhone: {
    fontSize: fontSizes.md,
    color: colors.light.muted,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.light.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginTop: -2,
  },
});
