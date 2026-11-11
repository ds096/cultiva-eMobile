import { theme } from "../../theme/theme";
import { Drawer } from "expo-router/drawer";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
// Componente que define logo, destinos e saída.
import AppDrawerContent from "../../components/AppDrawerContent";

// Define a navegação entre as áreas principais do aplicativo.
export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        // Cor de fundo do painel lateral.
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: "70%",
          maxWidth: 320,
        },

        // Cor do texto e dos ícones do item selecionado.
        drawerActiveTintColor: theme.colors.primary,

        // Fundo destacado para o item selecionado.
        drawerActiveBackgroundColor: theme.colors.secondaryContainer,

        // Cor dos itens que não estão selecionados.
        drawerInactiveTintColor: theme.colors.onSurface,

        // Espaçamento e formato de cada opção.
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 8,
          marginVertical: 4,
        },

        // Aparência dos títulos no cabeçalho.
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      {/* Cada Screen corresponde a um arquivo dentro de (drawer). */}
      <Drawer.Screen
        name="calendar"
        options={{
          title: "Calendário",
          drawerLabel: "Calendário",
          drawerIcon: ({ color, size }) => (
            <MaterialDesignIcons
              name="calendar-month"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="plots"
        options={{
          title: "Meus Talhões",
          drawerLabel: "Meus Talhões",
          drawerIcon: ({ color, size }) => (
            <MaterialDesignIcons name="sprout" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="plans"
        options={{
          title: "Planos de manejo",
          drawerLabel: "Planos de manejo",
          drawerIcon: ({ color, size }) => (
            <MaterialDesignIcons
              name="clipboard-text-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="supplies"
        options={{
          title: "Insumos",
          drawerLabel: "Insumos",
          drawerIcon: ({ color, size }) => (
            <MaterialDesignIcons
              name="package-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Configurações",
          drawerLabel: "Configurações",
          drawerIcon: ({ color, size }) => (
            <MaterialDesignIcons name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
