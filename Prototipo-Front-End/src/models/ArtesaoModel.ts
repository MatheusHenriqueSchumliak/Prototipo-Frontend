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

export const defaultArtesao: ArtesaoModel = {
    id: "",
    usuarioId: "",
    nomeCompleto: "",
    idade: 0,
    fotoUrl: "",
    imagem: null,
    nomeArtesao: "",
    descricaoPerfil: "",
    telefone: "",
    whatsApp: "",
    email: "",
    instagram: "",
    facebook: "",
    nichoAtuacao: "",
    receberEncomendas: false,
    enviaEncomendas: false,
    localFisico: false,
    feiraMunicipal: false,
    cep: "",
    estado: "",
    cidade: "",
    rua: "",
    bairro: "",
    complemento: "",
    numero: "",
    semNumero: false,
    dataCadastro: new Date()
};

export interface ArtesaoFormProps {
    artesao?: ArtesaoModel;
    onSubmit: (artesaoAtualizado: ArtesaoModel) => void;
}