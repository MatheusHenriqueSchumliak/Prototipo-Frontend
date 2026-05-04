import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cadastrarArtesao, atualizarArtesao } from "../api/artesaoApi";
import { defaultArtesaoForm } from "../types";
import type { ArtesaoFormViewModel } from "../types";
import { useViaCep } from "../../../shared/hooks/useViaCep";
import { mascaraTelefone } from "../../../shared/utils/masks";

export function useArtesaoForm(artesaoInicial?: Partial<ArtesaoFormViewModel>) {
  const queryClient = useQueryClient();
  const { buscarCep } = useViaCep();

  const [form, setForm] = useState<ArtesaoFormViewModel>({
    ...defaultArtesaoForm,
    ...artesaoInicial,
    usuarioId: artesaoInicial?.usuarioId ?? localStorage.getItem("usuarioId") ?? undefined,
  });

  const updateField = <K extends keyof ArtesaoFormViewModel>(
    field: K,
    value: ArtesaoFormViewModel[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTelefoneChange = (field: "telefone" | "whatsApp", value: string) => {
    updateField(field, mascaraTelefone(value));
  };

  const handleCepBlur = async () => {
    const result = await buscarCep(form.cep);
    if (result) {
      setForm((prev) => ({
        ...prev,
        estado: result.estado,
        cidade: result.cidade,
        rua: result.rua,
        bairro: result.bairro,
      }));
    }
  };

  const cadastrarMutation = useMutation({
    mutationFn: cadastrarArtesao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artesaos"] });
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, vm }: { id: string; vm: ArtesaoFormViewModel }) =>
      atualizarArtesao(id, vm),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["artesaos"] });
      queryClient.invalidateQueries({ queryKey: ["artesao", data.id] });
    },
  });

  const submitCadastro = () => cadastrarMutation.mutateAsync(form);
  const submitAtualizar = (id: string) =>
    atualizarMutation.mutateAsync({ id, vm: form });

  return {
    form,
    setForm,
    updateField,
    handleTelefoneChange,
    handleCepBlur,
    submitCadastro,
    submitAtualizar,
    isCadastrando: cadastrarMutation.isPending,
    isAtualizando: atualizarMutation.isPending,
    errorCadastro: cadastrarMutation.error,
    errorAtualizar: atualizarMutation.error,
  };
}
