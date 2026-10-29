import { router, usePathname, type Href } from "expo-router";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, tokens } from "../theme/theme";

type MenuItem = {
  label: string;
  icon: "calendar" | "plots" | "supplies" | "plans" | "settings";
  href: Href;
};

// Cada endereço corresponde a uma tela existente em src/app.
const items: MenuItem[] = [
  { label: "Calendário", icon: "calendar", href: "/calendar" },
  { label: "Talhões", icon: "plots", href: "/plots" },
  { label: "Insumos", icon: "supplies", href: "/supplies" },
  { label: "Planos", icon: "plans", href: "/plans" },
  { label: "Config", icon: "settings", href: "/settings" },
];

// Ícones de calendário, parcelas, embalagem, lista e ajustes, em uma grade 24 × 24.
// Usamos formas nativas porque a biblioteca de ícones não está instalada.
const iconParts: Record<MenuItem["icon"], ViewStyle[]> = {
  calendar: [
    { left: 3, top: 5, width: 18, height: 16, borderRadius: 3 },
    { left: 7, top: 2, width: 2, height: 6 },
    { left: 15, top: 2, width: 2, height: 6 },
    { left: 3, top: 10, width: 18, height: 2 },
    { left: 7, top: 14, width: 3, height: 3 },
    { left: 14, top: 14, width: 3, height: 3 },
  ],
  plots: [
    { left: 3, top: 3, width: 8, height: 8, borderRadius: 2 },
    { left: 13, top: 3, width: 8, height: 8, borderRadius: 2 },
    { left: 3, top: 13, width: 8, height: 8, borderRadius: 2 },
    { left: 13, top: 13, width: 8, height: 8, borderRadius: 2 },
  ],
  supplies: [
    { left: 8, top: 2, width: 8, height: 4, borderRadius: 1 },
    { left: 5, top: 7, width: 14, height: 15, borderRadius: 4 },
    { left: 9, top: 13, width: 6, height: 2 },
    { left: 11, top: 11, width: 2, height: 6 },
  ],
  plans: [
    { left: 4, top: 2, width: 16, height: 20, borderRadius: 3 },
    { left: 8, top: 7, width: 8, height: 2 },
    { left: 8, top: 11, width: 8, height: 2 },
    { left: 8, top: 15, width: 6, height: 2 },
  ],
  settings: [
    { left: 3, top: 5, width: 18, height: 2 },
    { left: 3, top: 11, width: 18, height: 2 },
    { left: 3, top: 17, width: 18, height: 2 },
    {
      left: 7,
      top: 3,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.surface,
    },
    {
      left: 14,
      top: 9,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.surface,
    },
    {
      left: 5,
      top: 15,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.surface,
    },
  ],
};

// A rota atual mantém o destaque correto, inclusive ao usar o botão Voltar.
export default function Menu() {
  const pathname = usePathname();
  const { width, fontScale } = useWindowDimensions();
  // Rótulos longos e fontes ampliadas ganham mais espaço, sem truncamento.
  const itemWidth = width < 400 || fontScale > 1.2 ? "33.333%" : "20%";

  function handleNavigate(item: MenuItem) {
    // Tocar novamente na tela ativa não cria outra entrada de navegação.
    if (pathname !== item.href) router.navigate(item.href);
  }

  return (
    // Respeita a barra do sistema; o teclado segue o comportamento nativo da tela.
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.menu}>
      <View style={styles.items}>
        {items.map((item) => {
          const selected = pathname === item.href;
          const color = selected
            ? theme.colors.primary
            : theme.colors.onSurfaceVariant;

          return (
            <TouchableRipple
              key={item.icon}
              onPress={() => handleNavigate(item)}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              accessibilityHint={`Abre a tela ${item.label}`}
              style={[
                styles.item,
                { width: itemWidth },
                selected && styles.selected,
              ]}
            >
              <View style={styles.content}>
                {/* O botão já anuncia o rótulo; as formas são apenas decorativas. */}
                <View
                  style={styles.icon}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  {iconParts[item.icon].map((part, index) => (
                    <View
                      key={index}
                      style={[styles.iconPart, part, { borderColor: color }]}
                    />
                  ))}
                </View>
                <Text
                  variant="labelMedium"
                  style={[
                    styles.label,
                    { color },
                    selected && styles.selectedLabel,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// A borda e o peso do texto indicam seleção também sem depender da cor.
const styles = StyleSheet.create({
  menu: {
    flexShrink: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  items: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  item: {
    minWidth: tokens.size.touch,
    minHeight: tokens.size.touch,
    borderTopWidth: 3,
    borderTopColor: "transparent",
  },
  selected: {
    borderTopColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  content: {
    alignItems: "center",
    paddingVertical: tokens.space.sm,
    paddingHorizontal: tokens.space.xs,
    gap: tokens.space.xs,
  },
  icon: { width: 24, height: 24 },
  iconPart: { position: "absolute", borderWidth: 2 },
  label: { textAlign: "center", alignSelf: "stretch" },
  selectedLabel: { fontWeight: "700" },
});
