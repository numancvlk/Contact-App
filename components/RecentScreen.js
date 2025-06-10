import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
  shadows,
} from "../style/Theme";

export default function RecentScreen({ navigation }) {
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    const loadRecents = async () => {
      const stored = await AsyncStorage.getItem("recentContacts");
      const parsed = stored ? JSON.parse(stored) : [];
      setRecents(parsed);
    };

    const unsubscribe = navigation.addListener("focus", loadRecents);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={recents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.light.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.light,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: "600",
    color: colors.light.primary,
    marginBottom: spacing.xs,
  },
  phone: {
    fontSize: fontSizes.md,
    color: colors.light.muted,
  },
});
