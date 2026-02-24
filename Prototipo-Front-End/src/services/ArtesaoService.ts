import { ArtesaoModel } from '../models/ArtesaoModel';
import { apiRequest } from './Api';

type BuscarArtesaoResponse = {
    message: string;
    data: ArtesaoModel;
};

export const listarArtesaos = async (filtro?: { nome?: string; nichoAtuacao?: string; receberEncomendas?: boolean | null; enviaEncomendas?: boolean | null; }): Promise<ArtesaoModel[]> => {
    const params = new URLSearchParams();

    if (filtro?.nome?.trim()) params.append("nome", filtro.nome.trim());
    if (filtro?.nichoAtuacao?.trim()) params.append("nichoAtuacao", filtro.nichoAtuacao.trim());
    if (typeof filtro?.receberEncomendas === "boolean") params.append("receberEncomendas", String(filtro.receberEncomendas));
    if (typeof filtro?.enviaEncomendas === "boolean") params.append("enviaEncomendas", String(filtro.enviaEncomendas));

    const url = params.toString()
        ? `Artesao/BuscarTodos?${params.toString()}`
        : "Artesao/BuscarTodos";

    try {
        const response = await apiRequest<ArtesaoModel[]>(url, null, "GET");

        if (import.meta.env.MODE === "development") {
            console.log("Resposta crua da API (artesãos):", response);
        }

        if (!Array.isArray(response)) {
            throw new Error("Resposta da API não contém uma lista de artesãos");
        }

        return response;
    } catch (error: any) {
        console.error("Erro ao listar artesãos:", error);
        throw new Error(error?.message || "Erro ao listar artesãos. Tente novamente mais tarde.");
    }
};

export const cadastrarArtesao = async (artesao: ArtesaoModel): Promise<ArtesaoModel> => {
    const formData = new FormData();

    //campos obrigatórios com nomes exatos do backend
    formData.append("Id", artesao.id ?? "");
    formData.append("UsuarioId", artesao.usuarioId ?? "");

    Object.entries(artesao).forEach(([key, value]) => {
        if (key === "id" || key === "usuarioId") return; // já adicionados acima

        if (value instanceof File) {
            formData.append(key, value);
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (Array.isArray(value)) {
            value.forEach((item, i) => formData.append(`${key}[${i}]`, item.toString()));
        } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    });

    // Log para debug
    // for (let pair of formData.entries()) {
    //     console.log(pair[0]+ ': ' + pair[1]);
    // }

    // 👇 Aqui o tipo de retorno esperado é o objeto JSON do artesão
    return await apiRequest<ArtesaoModel>("Artesao/Adicionar", formData, "POST");
};

export const atualizaArtesao = async (id: string, artesao: FormData): Promise<ArtesaoModel> => {
    if (!id) {
        throw new Error("O ID do artesão é inválido.");
    }

    const formData = new FormData();

    // Adiciona o ID explicitamente com o nome esperado pelo backend
    formData.append("Id", id);

    // Adiciona os demais campos, exceto o id (já enviado acima)
    Object.entries(artesao).forEach(([key, value]) => {
        if (key === "id") return; // já enviado como "Id"
        if (value instanceof File) {
            formData.append(key, value);
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (Array.isArray(value)) {
            value.forEach((item, i) => formData.append(`${key}[${i}]`, item.toString()));
        } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    });

    try {
        // Log apenas em desenvolvimento
        if (import.meta.env.MODE === "development") {
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
        }

        const resposta = await apiRequest<ArtesaoModel>(`Artesao/Atualizar/${id}`, formData, "PUT");
        return resposta;
    } catch (error) {
        console.error("Erro ao atualizar o artesão:", error);
        throw new Error("Erro ao atualizar o artesão. Tente novamente mais tarde.");
    }
};

export const deleteArtesao = async (id: string): Promise<void> => {
    if (!id?.trim()) throw new Error("O ID do artesão é inválido.");

    try {
        await apiRequest<void>(`Artesao/${id}`, null, "DELETE");
        if (import.meta.env.MODE === "development") {
            console.log(`Artesão com ID ${id} foi excluído com sucesso.`);
        }
    } catch (error: any) {
        console.error("Erro ao excluir artesão:", error);
        throw new Error(error?.message || "Erro ao excluir artesão. Tente novamente mais tarde.");
    }
};

export const buscarArtesaoPorId = async (id: string): Promise<ArtesaoModel> => {
    if (!id?.trim()) throw new Error("O ID do artesão é inválido.");

    try {
        const resposta = await apiRequest<BuscarArtesaoResponse>(`Artesao/BuscarPorId/${id}`, null, "GET");
        if (!resposta?.data) throw new Error("Artesão não encontrado.");
        if (import.meta.env.MODE === "development") {
            console.log("método buscarArtesaoPorId retornado da API:", JSON.stringify(resposta, null, 2));
        }
        return resposta.data;
    } catch (error: any) {
        console.error("Erro ao buscar artesão por ID:", error);
        throw new Error(error?.message || "Erro ao buscar artesão. Tente novamente mais tarde.");
    }
};

export const buscarArtesaoPorNome = async (nome: string): Promise<ArtesaoModel | null> => {
    if (!nome?.trim()) throw new Error("O nome do artesão é inválido.");

    try {
        const resposta = await apiRequest<ArtesaoModel>(`Artesao/ObterNomeArtesanato/${encodeURIComponent(nome)}`, null, "GET");
        if (import.meta.env.MODE === "development") {
            console.log("Artesão retornado da API:", JSON.stringify(resposta, null, 2));
        }
        return resposta || null;
    } catch (error: any) {
        console.error("Erro ao buscar artesão por nome:", error);
        throw new Error(error?.message || "Erro ao buscar artesão. Tente novamente mais tarde.");
    }
};
