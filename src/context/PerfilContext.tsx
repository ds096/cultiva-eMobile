import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { perfilRepository } from "../repositories/perfilRepository";

type PerfilContextType = {
  email: string | null;
  selectProfile: (email: string) => void;
  clearProfile: () => void;
};

const PerfilContext = createContext<PerfilContextType | null>(null);

// Compartilha a seleção de perfil entre os componentes descendentes.
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | undefined | null>(() =>
    perfilRepository.get(),
  );

  // Persiste a seleção antes de atualizar o estado compartilhado.
  function selectProfile(novoEmail: string) {
    perfilRepository.save(novoEmail);
    setEmail(novoEmail);
  }

  // Limpa somente a seleção de perfil, sem remover registros de trabalho.
  function clearProfile() {
    perfilRepository.remove();
    setEmail(null);
  }

  return (
    <PerfilContext.Provider value={{ email, selectProfile, clearProfile }}>
      {children}
    </PerfilContext.Provider>
  );
}

// Expõe o perfil e exige que o componente esteja dentro do provedor.
export function useProfile() {
  const contexto = useContext(PerfilContext);

  if (!contexto) {
    throw new Error("useProfile precisa de ProfileProvider");
  }

  return contexto;
}
