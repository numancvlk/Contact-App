import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
  shadows,
} from "../style/Theme";

export default function EditContactScreen({ route, navigation }) {
  const { contact, updateContact } = route.params;

  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [image, setImage] = useState(contact.image);

  const handleSave = () => {
    if (!name || !phone) {
      Alert.alert("Invalid Input", "Name and phone fields are required");
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      Alert.alert(
        "Invalid Phone",
        "Phone number must consist of digits only and be exactly 11 characters long."
      );
      return;
    }

    const updateRecents = async (updatedContact) => {
      try {
        const stored = await AsyncStorage.getItem("recentContacts");
        let recents = stored ? JSON.parse(stored) : [];

        recents = recents.map((item) =>
          item.id === updatedContact.id ? updatedContact : item
        );

        await AsyncStorage.setItem("recentContacts", JSON.stringify(recents));
      } catch (err) {
        console.log("Recent güncellenemedi:", err);
      }
    };

    const updatedContact = {
      ...contact,
      name,
      phone,
      image,
    };

    updateContact(updatedContact);
    updateRecents(updatedContact);
    navigation.navigate("ContactsScreen");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Fullname"
        value={name}
        onChangeText={setName}
        placeholderTextColor={colors.light.muted}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        maxLength={11}
        keyboardType="phone-pad"
        placeholderTextColor={colors.light.muted}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        placeholderTextColor={colors.light.muted}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    marginBottom: spacing.md,
    color: colors.light.text,
    ...shadows.light,
  },
  button: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.lg,
    ...shadows.light,
  },
  buttonText: {
    color: "#fff",
    fontSize: fontSizes.lg,
    fontWeight: "bold",
  },
});
