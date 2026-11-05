import { useState, useCallback } from "react";
import { FlatList, View, Text, Pressable, StyleSheet } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Plot, getCurrentRevision } from "../domain/plot";
import { useProfile } from "../context/ProfileContext";
import { plotRepository } from "../repositories/plotRepository";

type LoadStatus = "loading" | "ready" | "error";

export default function PlotsScreen() {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [plots, setPlots] = useState<Plot[]>([]);
  const { email } = useProfile();

  useFocusEffect(
    useCallback(() => {
      if (!email) {
        setPlots([]);
        setStatus("ready");
        return;
      }

      setStatus("loading");

      try {
        const data = plotRepository.list(email);
        setPlots(data);
        setStatus("ready");
      } catch {
        setPlots([]);
        setStatus("error");
      }
    }, [email]),
  );

  if (status === "loading") {
    return <Text>Carregando talhões...</Text>;
  }

  if (status === "error") {
    return <Text>Erro ao carregar talhões.</Text>;
  }

  return (
    <FlatList
      data={plots}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Pressable
          onPress={() => router.push("/createPlot")}
          style={{
            backgroundColor: "#2E7D32",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
            + Adicionar talhão
          </Text>
        </Pressable>
      }

      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{getCurrentRevision(item).data.name}</Text>

          <Pressable
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/plot/[id]",
                params: { id: item.id },
              })
            }
          >
            <Text>Ver Detalhes</Text>
          </Pressable>
        </View>
      )}
      ListEmptyComponent={
        <Text>Você ainda não possui talhões cadastrados.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  button: {
    alignSelf: "flex-start",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
  },
});
