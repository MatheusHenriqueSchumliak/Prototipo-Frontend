export interface ArtesaoModel {
    Id?: string;
    UsuarioId?: string;
    NomeCompleto?: string;
    Idade?: number;
    FotoUrl?: string;
    Imagem?: File | null;
    NomeArtesao?: string;
    DescricaoPerfil?: string;
    Telefone?: string;
    WhatsApp?: string;
    Email?: string;
    Instagram?: string;
    Facebook?: string;
    NichoAtuacao?: string;
    ReceberEncomendas?: boolean;
    EnviaEncomendas?: boolean;
    LocalFisico?: boolean;
    FeiraMunicipal?: boolean;
    CEP?: string;
    Estado?: string;
    Cidade?: string;
    Rua?: string;
    Bairro?: string;
    Complemento?: string;
    Numero?: string;
    SemNumero?: boolean;
    DataCadastro?: Date;
}

export interface ArtesaoFormProps {
    artesao?: ArtesaoModel;
    onSubmit: (artesaoAtualizado: ArtesaoModel) => void;
}