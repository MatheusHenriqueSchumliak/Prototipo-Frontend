import { apiRequest } from './Api';
import { ArtesaoModel } from '../models/ArtesaoModel';

type BuscarArtesaoResponse = {
    message: string;
    data: ArtesaoModel;
};

export const listarArtesaos = async (filtro?: {
    nome?: string;
    nichoAtuacao?: string;
    receberEncomendas?: boolean | null;
    enviaEncomendas?: boolean | null;
}): Promise<ArtesaoModel[]> => {
    const params = new URLSearchParams();
    if (filtro?.nome) params.append("nome", filtro.nome);
    if (filtro?.nichoAtuacao) params.append("nichoAtuacao", filtro.nichoAtuacao);
    if (filtro?.receberEncomendas != null) params.append("receberEncomendas", String(filtro.receberEncomendas));
    if (filtro?.enviaEncomendas != null) params.append("enviaEncomendas", String(filtro.enviaEncomendas));

    const url = `Artesao/BuscarTodos?${params.toString()}`;
    return await apiRequest<ArtesaoModel[]>(url, null, "GET");
};

export const cadastrarArtesao = async (artesao: ArtesaoModel): Promise<ArtesaoModel> => {
    const formData = new FormData();

    Object.entries(artesao).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item, i) => formData.append(`${key}[${i}]`, item.toString()));
        } else if (value != null) {
            formData.append(key, value.toString());
        }
    });

    // 👇 Aqui o tipo de retorno esperado é o objeto JSON do artesão
    return await apiRequest<ArtesaoModel>("Artesao/Adicionar", formData, "POST");
};

export const atualizaArtesao = async (id: string, artesao: FormData): Promise<ArtesaoModel> => {
    const formData = new FormData();
    if (!id) {
        throw new Error("O ID do artesão é inválido.");
    }   

    // Adicionar o ID explicitamente
    formData.append('Id', id.toString());

    Object.entries(artesao).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            // Para arrays de arquivos (imagens múltiplas)
            value.forEach((item) => {
                if (item instanceof File) {
                    formData.append(key, item);
                } else {
                    formData.append(key, item.toString());
                }
            });
        } else if (value != null) {
            formData.append(key, value.toString());
        }
    });
    
    // Faz a requisição para atualizar o artesão
    try {
        console.log("Artesão enviado para a API:", JSON.stringify(formData, null, 2));

        const artesao = await apiRequest<ArtesaoModel>(`Artesao/Atualizar/${id}`, formData, "PUT");

        console.log("Artesão atualizado:", JSON.stringify(artesao, null, 2));
        return artesao;
    } catch (error) {
        console.error("Erro ao atualizar o artesão:", error);
        throw new Error("Erro ao atualizar o artesão. Tente novamente mais tarde.");
    }

};

export const deleteArtesao = async (id: string): Promise<void> => {
    if (!id) {
        throw new Error("O ID do artesão é inválido.");
    }

    try {
        await apiRequest<void>(`artesao/${id}`, null, "DELETE");
        console.log(`Artesão com ID ${id} foi excluído com sucesso.`);
    } catch (error) {
        console.error("Erro ao excluir artesão:", error);
        throw new Error("Erro ao excluir artesão. Tente novamente mais tarde.");
    }
};

export const buscarArtesaoPorId = async (id: string): Promise<ArtesaoModel> => {
    if (!id) {
        throw new Error("O ID do artesão é inválido.");
    }

    try {
        const resposta = await apiRequest<BuscarArtesaoResponse>(`Artesao/BuscarPorId/${id}`, null, "GET");
        console.log("método buscarArtesaoPorId retornado da API:", JSON.stringify(resposta, null, 2));
        return resposta.data;
    } catch (error) {
        console.error("Erro ao buscar artesão por ID:", error);
        throw new Error("Erro ao buscar artesão. Tente novamente mais tarde.");
    }
};

export const buscarArtesaoPorNome = async (nome: string): Promise<ArtesaoModel | null> => {
    if (!nome) {
        throw new Error("O nome do artesão é inválido.");
    }

    try {
        const artesao = await apiRequest<ArtesaoModel>(`Artesao/ObterNomeArtesanato/${nome}`, null, "GET");
        console.log("Artesão retornado da API:", JSON.stringify(artesao, null, 2));
        return artesao || null; // Retorna null caso não encontre
    } catch (error) {
        console.error("Erro ao buscar artesão por nome:", error);
        throw new Error("Erro ao buscar artesão. Tente novamente mais tarde.");
    }
};
