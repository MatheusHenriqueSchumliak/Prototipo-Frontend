import { useState } from "react";

export interface ViaCepResult {
  cep: string;
  estado: string;
  cidade: string;
  rua: string;
  bairro: string;
}

export function useViaCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarCep = async (cep: string): Promise<ViaCepResult | null> => {
    const cleaned = cep.replace(/\D/g, "");
    if (cleaned.length !== 8) {
      setError("CEP deve ter 8 dígitos.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado.");
        return null;
      }

      return {
        cep: data.cep,
        estado: data.uf,
        cidade: data.localidade,
        rua: data.logradouro,
        bairro: data.bairro,
      };
    } catch {
      setError("Erro ao buscar CEP. Tente novamente.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCep, loading, error };
}
