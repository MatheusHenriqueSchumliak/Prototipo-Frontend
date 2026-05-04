import { apiRequest } from "../../../shared/api/apiClient";
import type { ArtesanatoDTO, ArtesanatoFormViewModel } from "../types";
import { viewModelToFormData } from "../mappers/artesanatoMapper";

type BuscarArtesanatoResponse = {
  message: string;
  data: ArtesanatoDTO;
};

export const listarArtesanatos = async (): Promise<ArtesanatoDTO[]> => {
  const response = await apiRequest<ArtesanatoDTO[]>(
    "Artesanato/BuscarTodos",
    null,
    "GET"
  );
  if (!Array.isArray(response)) {
    throw new Error("Resposta da API não contém uma lista de artesanatos");
  }
  return response;
};

export const buscarArtesanatoPorId = async (
  id: string
): Promise<ArtesanatoDTO> => {
  if (!id) throw new Error("O ID do artesanato é inválido.");
  const resposta = await apiRequest<BuscarArtesanatoResponse>(
    `Artesanato/BuscarPorId/${id}`,
    null,
    "GET"
  );
  return resposta.data;
};

export const buscarArtesanatosPorArtesao = async (
  artesaoId: string
): Promise<ArtesanatoDTO[]> => {
  if (!artesaoId) throw new Error("O ID do artesão é inválido.");
  const response = await apiRequest<ArtesanatoDTO[]>(
    `Artesanato/TodosPorArtesao/${artesaoId}`,
    null,
    "GET"
  );
  return Array.isArray(response) ? response : [response as ArtesanatoDTO];
};

export const cadastrarArtesanato = async (
  vm: ArtesanatoFormViewModel
): Promise<ArtesanatoDTO> => {
  const formData = viewModelToFormData(vm);
  return await apiRequest<ArtesanatoDTO>("Artesanato/Adicionar", formData, "POST");
};

export const atualizarArtesanato = async (
  id: string,
  vm: ArtesanatoFormViewModel
): Promise<ArtesanatoDTO> => {
  if (!id) throw new Error("O ID do artesanato é inválido.");
  const formData = viewModelToFormData({ ...vm, id });
  return await apiRequest<ArtesanatoDTO>(
    `Artesanato/Atualizar/${id}`,
    formData,
    "PUT"
  );
};

export const deletarArtesanato = async (id: string): Promise<void> => {
  if (!id) throw new Error("O ID do artesanato é inválido.");
  await apiRequest<void>(`Artesanato/Excluir/${id}`, null, "DELETE");
};
