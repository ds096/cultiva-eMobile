import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Olá mundo!! De dentro da pasta App!! Cara eu to mto feliz!!</Text>
      <StatusBar style="auto" />
      <AppButton
        title="Continuar"
        onPress={() => console.log("Botão pressionado")}
      />
      <AppButton
        title="Continuar"
        onPress={() => console.log("Botão pressionado")}
      />
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
