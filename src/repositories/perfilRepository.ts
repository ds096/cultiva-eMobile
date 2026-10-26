import { createMMKV } from "react-native-mmkv";

type Storage = ReturnType<typeof createMMKV>;

let storage: Storage | null = null;

const PERFIL_KEY = "perfil.email";

// Cria o armazenamento apenas quando alguma operação precisar dele.
function getStorage(): Storage {
  if (storage === null) {
    // Se a criação falhar, a atribuição não acontece:
    // storage continua null e uma nova tentativa poderá criar a instância.
    storage = createMMKV({
      id: "cultiva-e-perfil",
    });
  }

  return storage;
}

export const perfilRepository = {
  // Persiste a seleção no armazenamento compartilhado.
  save(email: string): void {
    getStorage().set(PERFIL_KEY, email);
  },

  // Retorna null somente quando a leitura termina sem encontrar seleção.
  get(): string | null {
    return getStorage().getString(PERFIL_KEY) ?? null;
  },

  // Remove apenas a seleção atual.
  remove(): void {
    getStorage().remove(PERFIL_KEY);
  },
};
