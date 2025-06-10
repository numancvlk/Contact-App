import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
  shadows,
} from "../style/Theme";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem("favorites");
      if (stored) setFavorites(JSON.parse(stored));
    };

    const unsubscribe = navigation.addListener("focus", loadFavorites);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={myStyles.container}>
      {favorites.length === 0 ? (
        <Text style={myStyles.emptyText}>No favorite contacts yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={myStyles.card}>
              <Text style={myStyles.name}>{item.name}</Text>
              <Text style={myStyles.phone}>{item.phone}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const myStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: spacing.md,
  },
  emptyText: {
    fontSize: fontSizes.xl,
    color: colors.light.text,
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    backgroundColor: colors.light.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.light,
  },
  name: {
    fontSize: fontSizes.lg,
    color: colors.light.primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  phone: {
    fontSize: fontSizes.md,
    color: colors.light.muted,
  },
});
