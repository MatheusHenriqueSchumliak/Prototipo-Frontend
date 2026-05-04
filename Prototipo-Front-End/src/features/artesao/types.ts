import type { PessoaDTO } from "../pessoa/types";

/** Espelho exato do JSON retornado pelo endpoint Artesao/BuscarTodos e BuscarPorId */
export interface ArtesaoDTO {
  id: string;
  usuarioId: string;
  pessoa: PessoaDTO;
  fotoUrl?: string;
  nomeArtesao?: string;
  descricaoPerfil?: string;
  nichoAtuacao?: string;
  receberEncomendas: boolean;
  enviaEncomendas: boolean;
  localFisico: boolean;
  feiraMunicipal: boolean;
  dataCadastro?: string;
}

/** Modelo flat usado pelo formulário e pelas pages */
export interface ArtesaoFormViewModel {
  id?: string;
  usuarioId?: string;
  imagem?: File | null;
  fotoUrl?: string;
  nomeArtesao: string;
  nomeCompleto: string;
  idade: number;
  descricaoPerfil: string;
  telefone: string;
  whatsApp: string;
  email: string;
  instagram: string;
  facebook: string;
  nichoAtuacao: string;
  receberEncomendas: boolean;
  enviaEncomendas: boolean;
  localFisico: boolean;
  feiraMunicipal: boolean;
  cep: string;
  estado: string;
  cidade: string;
  rua: string;
  bairro: string;
  complemento: string;
  numero: string;
  semNumero: boolean;
}

export const defaultArtesaoForm: ArtesaoFormViewModel = {
  nomeArtesao: "",
  nomeCompleto: "",
  idade: 0,
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
  imagem: null,
};
