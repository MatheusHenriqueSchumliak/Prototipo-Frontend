import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cadastrarArtesanato, atualizarArtesanato } from "../api/artesanatoApi";
import { defaultArtesanatoForm } from "../types";
import type { ArtesanatoFormViewModel } from "../types";

export function useArtesanatoForm(
  artesanatoInicial?: Partial<ArtesanatoFormViewModel>
) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ArtesanatoFormViewModel>({
    ...defaultArtesanatoForm,
    ...artesanatoInicial,
    usuarioId:
      artesanatoInicial?.usuarioId ??
      localStorage.getItem("usuarioId") ??
      undefined,
    artesaoId:
      artesanatoInicial?.artesaoId ??
      localStorage.getItem("ArtesaoId") ??
      undefined,
  });

  const updateField = <K extends keyof ArtesanatoFormViewModel>(
    field: K,
    value: ArtesanatoFormViewModel[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const cadastrarMutation = useMutation({
    mutationFn: cadastrarArtesanato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artesanatos"] });
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, vm }: { id: string; vm: ArtesanatoFormViewModel }) =>
      atualizarArtesanato(id, vm),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["artesanatos"] });
      queryClient.invalidateQueries({ queryKey: ["artesanato", data.id] });
    },
  });

  const submitCadastro = () => cadastrarMutation.mutateAsync(form);
  const submitAtualizar = (id: string) =>
    atualizarMutation.mutateAsync({ id, vm: form });

  return {
    form,
    setForm,
    updateField,
    submitCadastro,
    submitAtualizar,
    isCadastrando: cadastrarMutation.isPending,
    isAtualizando: atualizarMutation.isPending,
    errorCadastro: cadastrarMutation.error,
    errorAtualizar: atualizarMutation.error,
  };
}
