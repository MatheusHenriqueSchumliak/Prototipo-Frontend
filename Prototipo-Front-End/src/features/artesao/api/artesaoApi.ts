import { apiRequest } from "../../../shared/api/apiClient";
import type { ArtesaoDTO, ArtesaoFormViewModel } from "../types";
import { viewModelToFormData } from "../mappers/artesaoMapper";

type BuscarArtesaoResponse = {
  message: string;
  data: ArtesaoDTO;
};

export interface ArtesaoFiltro {
  nome?: string;
  nichoAtuacao?: string;
  receberEncomendas?: boolean | null;
  enviaEncomendas?: boolean | null;
}

export const listarArtesaos = async (
  filtro?: ArtesaoFiltro
): Promise<ArtesaoDTO[]> => {
  const params = new URLSearchParams();

  if (filtro?.nome?.trim()) params.append("nome", filtro.nome.trim());
  if (filtro?.nichoAtuacao?.trim())
    params.append("nichoAtuacao", filtro.nichoAtuacao.trim());
  if (typeof filtro?.receberEncomendas === "boolean")
    params.append("receberEncomendas", String(filtro.receberEncomendas));
  if (typeof filtro?.enviaEncomendas === "boolean")
    params.append("enviaEncomendas", String(filtro.enviaEncomendas));

  const url = params.toString()
    ? `Artesao/BuscarTodos?${params.toString()}`
    : "Artesao/BuscarTodos";

  const response = await apiRequest<ArtesaoDTO[]>(url, null, "GET");

  if (!Array.isArray(response)) {
    throw new Error("Resposta da API não contém uma lista de artesãos");
  }

  return response;
};

export const buscarArtesaoPorId = async (id: string): Promise<ArtesaoDTO> => {
  if (!id?.trim()) throw new Error("O ID do artesão é inválido.");

  const resposta = await apiRequest<BuscarArtesaoResponse>(
    `Artesao/BuscarPorId/${id}`,
    null,
    "GET"
  );

  if (!resposta?.data) throw new Error("Artesão não encontrado.");
  return resposta.data;
};

export const cadastrarArtesao = async (
  vm: ArtesaoFormViewModel
): Promise<ArtesaoDTO> => {
  const formData = viewModelToFormData(vm);
  return await apiRequest<ArtesaoDTO>("Artesao/Adicionar", formData, "POST");
};

export const atualizarArtesao = async (
  id: string,
  vm: ArtesaoFormViewModel
): Promise<ArtesaoDTO> => {
  if (!id) throw new Error("O ID do artesão é inválido.");
  const formData = viewModelToFormData({ ...vm, id });
  return await apiRequest<ArtesaoDTO>(`Artesao/Atualizar/${id}`, formData, "PUT");
};

export const deletarArtesao = async (id: string): Promise<void> => {
  if (!id?.trim()) throw new Error("O ID do artesão é inválido.");
  await apiRequest<void>(`Artesao/${id}`, null, "DELETE");
};
