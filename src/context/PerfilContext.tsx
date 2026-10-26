import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { perfilRepository } from "../repositories/perfilRepository";

// Preserva o contrato consumido pelo layout atual.
type RestorationStatus = "loading" | "ready" | "error";

// Uma leitura síncrona termina com sucesso ou com erro.
type ProfileState = {
  email: string | null;
  restorationStatus: "ready" | "error";
};

// Define os dados e as operações compartilhados com as telas.
type PerfilContextType = {
  email: string | null;
  restorationStatus: RestorationStatus;
  restoreProfile: () => void;
  selectProfile: (email: string) => void;
  clearProfile: () => void;
};

// O valor padrão denuncia a ausência do provedor.
const PerfilContext = createContext<PerfilContextType | null>(null);

// Consulta o armazenamento sem gravar nem apagar dados de perfil.
function readProfile(): ProfileState {
  try {
    return {
      email: perfilRepository.get(),
      restorationStatus: "ready",
    };
  } catch {
    // O status impede interpretar esse null como ausência confirmada.
    return { email: null, restorationStatus: "error" };
  }
}

// Mantém a seleção compartilhada e coordena suas operações locais.
export function ProfileProvider({ children }: { children: ReactNode }) {
  // Passa a função, sem chamá-la: React obtém o estado inicial na montagem.
  const [profile, setProfile] = useState<ProfileState>(readProfile);

  // O botão de nova tentativa repete a leitura protegida.
  function restoreProfile() {
    setProfile(readProfile());
  }

  // Só publica a nova seleção depois de conseguir persistir.
  function selectProfile(novoEmail: string) {
    perfilRepository.save(novoEmail);
    setProfile({ email: novoEmail, restorationStatus: "ready" });
  }

  // Só confirma a saída depois de remover a seleção persistida.
  function clearProfile() {
    perfilRepository.remove();
    setProfile({ email: null, restorationStatus: "ready" });
  }

  // Compartilha o estado e as ações com os componentes descendentes.
  return (
    <PerfilContext.Provider
      value={{ ...profile, restoreProfile, selectProfile, clearProfile }}
    >
      {children}
    </PerfilContext.Provider>
  );
}

// Centraliza a leitura e exige o provedor correspondente.
export function useProfile() {
  const contexto = useContext(PerfilContext);
  if (!contexto) {
    throw new Error("useProfile precisa de ProfileProvider");
  }
  return contexto;
}
