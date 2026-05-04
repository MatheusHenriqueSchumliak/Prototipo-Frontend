export interface EnderecoDTO {
  cep: string;
  estado: string;
  cidade: string;
  rua: string;
  bairro: string;
  complemento?: string;
  numero?: string;
  semNumero: boolean;
}

export interface ContatoDTO {
  telefone?: string;
  whatsApp?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
}

export interface PessoaDTO {
  id: string;
  nomeCompleto: string;
  idade?: number;
  endereco: EnderecoDTO;
  contato: ContatoDTO;
}
