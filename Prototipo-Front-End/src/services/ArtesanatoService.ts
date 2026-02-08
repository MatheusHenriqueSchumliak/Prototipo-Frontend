import { ArtesanatoModel } from '../models/ArtesanatoModel';
import { apiRequest } from './Api';

type BuscarArtesanatoResponse = {
  message: string;
  data: ArtesanatoModel;
};

interface ApiResponse<T> {
  data: T;
}

export const listarArtesanatos = async (): Promise<ArtesanatoModel[]> => {
  const response = await apiRequest<ApiResponse<ArtesanatoModel[]>>(
    "Artesanato/BuscarTodos",
    null,
    "GET"
  );

  console.log("Resposta crua da API:", response);

  if (!Array.isArray(response.data)) {
    throw new Error("Resposta da API não contém uma lista de artesanatos");
  }

  return response.data;
};

export const cadastrarArtesanato = async (artesanato: ArtesanatoModel): Promise<ArtesanatoModel> => {
  const formData = new FormData();

  Object.entries(artesanato).forEach(([key, value]) => {
    if (key === "Imagem" && Array.isArray(value)) {
      // Tratar a lista de imagens corretamente
      value.forEach((file) => {
        if (file instanceof File) {
          formData.append("imagem", file); // O nome tem que ser igual ao esperado no backend
        }
      });
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => formData.append(`${key}[${i}]`, item.toString()));
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString()); // Corrige o formato da data
    } else if (value != null) {
      formData.append(key, value.toString());
    }
  });

  return await apiRequest<ArtesanatoModel>("Artesanato/Adicionar", formData, "POST");
};

export const atualizaArtesanato = async (id: string, artesanatoAtualizado: FormData): Promise<ArtesanatoModel> => {
  if (!id) {
    throw new Error("O ID do artesanato é inválido.");
  }
  try {
    console.log("Artesanato enviado para a API:", JSON.stringify(artesanatoAtualizado, null, 2));


    const artesanato = await apiRequest<ArtesanatoModel>(`artesanato/${id}`, artesanatoAtualizado, "PUT");

    console.log("Artesanato atualizado:", JSON.stringify(artesanato, null, 2));
    return artesanato;
  } catch (error) {
    console.error("Erro ao atualizar o artesanato:", error);
    throw new Error("Erro ao atualizar o artesanato. Tente novamente mais tarde.");
  }

};

export const deleteArtesanato = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error("O ID do artesanato é inválido.");
  }

  try {
    await apiRequest<void>(`artesanato/${id}`, null, "DELETE");
    console.log(`Artesanato com ID ${id} foi excluído com sucesso.`);
  } catch (error) {
    console.error("Erro ao excluir artesanato:", error);
    throw new Error("Erro ao excluir artesanato. Tente novamente mais tarde.");
  }
};

export const BuscarArtesanatoPorId = async (id: string): Promise<ArtesanatoModel> => {
  if (!id) {
    throw new Error("O ID do artesanato é inválido.");
  }

  try {
    const resposta = await apiRequest<BuscarArtesanatoResponse>(`Artesanato/BuscarPorId/${id}`, null, "GET");
    console.log("método buscarArtesanatoPorId retornado da API:", JSON.stringify(resposta, null, 2));
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar artesanato por ID:", error);
    throw new Error("Erro ao buscar artesanato. Tente novamente mais tarde.");
  }
};

export const BuscarArtesanatoPorArtesaoId = async (id: string): Promise<ArtesanatoModel> => {
  if (!id) {
    throw new Error("O ID do artesão é inválido.");
  }

  try {
    const resposta = await apiRequest<BuscarArtesanatoResponse>(`Artesanato/BuscarTodosPorArtesaoId/${id}`, null, "GET");
    console.log("método buscarArtesanatoPorArtesaoId retornado da API:", JSON.stringify(resposta, null, 2));
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar artesanato por ID:", error);
    throw new Error("Erro ao buscar artesanato. Tente novamente mais tarde.");
  }
};

