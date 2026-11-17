import { useState, useCallback } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plot } from "../../domain/plot";
import { useProfile } from "../../context/ProfileContext";
import { plotRepository } from "../../repositories/plotRepository";
import { PlotCard } from "../../components/PlotCard";
import { tokens } from "../../theme/theme";

type LoadStatus = "loading" | "ready" | "error";

export default function PlotsScreen() {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [erro, setErro] = useState("");
  const [plots, setPlots] = useState<Plot[]>([]);
  const { email, clearProfile } = useProfile();

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
    return (
      <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
        <Text>Carregando talhões...</Text>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
        <Text>Não foi possível carregar os talhões.</Text>
        <Button onPress={handleExit}>Sair</Button>
      </SafeAreaView>
    );
  }

  function handleExit() {
    setErro("");

    try {
      // Após remover a seleção, o provedor atualiza email para null.
      clearProfile();
    } catch {
      // A mensagem permite compreender por que a tela permaneceu aberta.
      setErro("Não foi possível sair do perfil. Tente novamente.");
    }
  }

  function handleViewDetails(id: string) {
    router.push({
      pathname: "/plot/[id]",
      params: { id },
    });
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
      <FlatList
        data={plots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Button
            mode="contained"
            onPress={() => router.push("/createPlot")}
            style={styles.createButton}
            contentStyle={styles.createButtonContent}
          >
            Cadastrar Novo Talhão
          </Button>
        }

        renderItem={({ item }) => (
          <PlotCard plot={item} onPressDetails={handleViewDetails} />
        )}
        ListEmptyComponent={
          <Text>Você ainda não possui talhões cadastrados.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: tokens.space.md,
    gap: tokens.space.md,
  },

  createButton: {
    borderRadius: tokens.radius.card,
  },

  createButtonContent: {
    minHeight: 52,
  },
});
