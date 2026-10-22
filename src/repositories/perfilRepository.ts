import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "cultiva-e-perfil",
});

const PERFIL_KEY = "perfil.email";

export const perfilRepository = {
  save(email: string): void {
    storage.set(PERFIL_KEY, email);
  },

  get(): string | undefined {
    return storage.getString(PERFIL_KEY);
  },

  remove(): void {
    storage.remove(PERFIL_KEY);
  },
};
