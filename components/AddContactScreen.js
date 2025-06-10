import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import { colors, spacing } from "../style/Theme";

export default function AddContactScreen({ navigation, route }) {
  const { addContact } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  const handleAdd = () => {
    if (!name) {
      Alert.alert("Invalid Input", "Name is required.");
      return;
    }

    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Invalid Phone",
        "Phone number must be exactly 11 digits and contain only numbers."
      );
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name: name,
      phone: phone,
      image: image,
    };

    addContact(newContact);
    setName("");
    setPhone("");
    setImage("");
    navigation.goBack();
  };

  return (
    <View style={myStyles.container}>
      <TextInput
        style={myStyles.input}
        placeholder="Full Name"
        value={name}
        placeholderTextColor={colors.light.subtleText}
        onChangeText={(text) => {
          setName(text);
        }}
      />
      <TextInput
        style={myStyles.input}
        placeholder="Phone (11 digits)"
        value={phone}
        placeholderTextColor={colors.light.subtleText}
        keyboardType="numeric"
        onChangeText={(text) => {
          setPhone(text);
        }}
        maxLength={11}
      />
      <TextInput
        style={myStyles.input}
        placeholder="Image URL (OPTIONAL)"
        value={image}
        placeholderTextColor={colors.light.subtleText}
        onChangeText={setImage}
      />
      <TouchableOpacity style={myStyles.button} onPress={handleAdd}>
        <Text style={myStyles.buttonText}>Add Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light.subtleText,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 16,
    color: colors.light.text,
  },
  button: {
    backgroundColor: colors.light.accent,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    marginTop: spacing.md,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
