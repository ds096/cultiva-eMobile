import { useState } from "react";
import { Redirect } from "expo-router";
import { ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { plotRepository } from "../repositories/plotRepository";
import { useProfile } from "../context/ProfileContext";
import { theme, tokens } from "../theme/theme";

// Falha de leitura nunca significa que o perfil está sem talhões.
function readDestination(email: string): "/calendar" | "/plots" | null {
  try {
    return plotRepository.list(email).length > 0 ? "/calendar" : "/plots";
  } catch {
    return null;
  }
}

export default function ProfileLanding({ email }: { email: string }) {
  const [destination, setDestination] = useState(() => readDestination(email));
  const [exitError, setExitError] = useState("");
  const { clearProfile } = useProfile();

  if (destination) return <Redirect href={destination} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: tokens.space.lg,
          gap: tokens.space.md,
        }}
      >
        <Text accessibilityRole="alert">
          Não foi possível consultar seus talhões. Tente novamente para abrir o
          perfil.
        </Text>
        <Button
          mode="contained"
          onPress={() => setDestination(readDestination(email))}
        >
          Tentar novamente
        </Button>
        <Button
          onPress={() => {
            try {
              clearProfile();
            } catch {
              setExitError("Não foi possível sair do perfil. Tente novamente.");
            }
          }}
        >
          Sair do perfil
        </Button>
        {exitError !== "" && <Text accessibilityRole="alert">{exitError}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
