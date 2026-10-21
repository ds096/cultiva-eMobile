import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { router } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Olá mundo!! De dentro da pasta App!! Cara eu to mto feliz!!</Text>
      <Text>Tela de Login</Text>
      <StatusBar style="auto" />
      <AppButton title="Talhoes" onPress={() => router.push("/plots")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
