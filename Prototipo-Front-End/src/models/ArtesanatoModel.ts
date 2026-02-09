export interface ArtesanatoModel {
    id: string;
    usuarioId: string;
    artesaoId: string;
    imagemUrl: string[];
    imagem: (string | File)[];
    tituloArtesanato: string;
    descricaoArtesanato: string;
    sobEncomenda: boolean;    
    aceitaEncomenda: boolean;
    categoriaTags: string[];
    preco: number;
    quantidadeArtesanato: number;
    materiaisUtilizados: string;
    dataCriacao: Date;
    tempoCriacaoHr: string;
}

export interface ArtesanatoFormProps {
    artesanato?: Partial<ArtesanatoModel>;
    onSubmit: (artesanatoAtualizado: ArtesanatoModel) => void;
}
// Funções relacionadas ao modelo
export const getHoraAtual = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};
