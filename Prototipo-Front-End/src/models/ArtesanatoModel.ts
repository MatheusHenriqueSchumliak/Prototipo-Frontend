export interface ArtesanatoModel {
    Id: string;
    UsuarioId: string;
    ArtesaoId: string;
    ImagemUrl: string[];
    Imagem: (string | File)[];
    TituloArtesanato: string;
    DescricaoArtesanato: string;
    SobEncomenda: boolean;    
    AceitaEncomenda: boolean;
    CategoriaTags: string[];
    Preco: number;
    QuantidadeArtesanato: number;
    MateriaisUtilizados: string;
    DataCriacao: Date;
    TempoCriacaoHr: string;
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
