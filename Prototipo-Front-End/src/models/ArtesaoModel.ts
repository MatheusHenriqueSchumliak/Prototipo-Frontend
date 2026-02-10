export interface ArtesaoModel {
    id?: string;
    usuarioId?: string;
    nomeCompleto?: string;
    idade?: number;
    fotoUrl?: string;
    imagem?: File | null;
    nomeArtesao?: string;
    descricaoPerfil?: string;
    telefone?: string;
    whatsApp?: string;
    email?: string;
    instagram?: string;
    facebook?: string;
    nichoAtuacao?: string;
    receberEncomendas?: boolean;
    enviaEncomendas?: boolean;
    localFisico?: boolean;
    feiraMunicipal?: boolean;
    cep?: string;
    estado?: string;
    cidade?: string;
    rua?: string;
    bairro?: string;
    complemento?: string;
    numero?: string;
    semNumero?: boolean;
    dataCadastro?: Date;
}

export interface ArtesaoFormProps {
    artesao?: ArtesaoModel;
    onSubmit: (artesaoAtualizado: ArtesaoModel) => void;
}