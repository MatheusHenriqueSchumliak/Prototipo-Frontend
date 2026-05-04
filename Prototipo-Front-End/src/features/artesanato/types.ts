/** Espelho exato do JSON retornado pelo endpoint Artesanato */
export interface ArtesanatoDTO {
  id: string;
  usuarioId: string;
  artesaoId: string;
  imagemUrl: string[];
  tituloArtesanato: string;
  descricaoArtesanato: string;
  sobEncomenda: boolean;
  aceitaEncomenda: boolean;
  categoriaTags: string[];
  preco: number;
  quantidadeArtesanato: number;
  materiaisUtilizados: string;
  dataCriacao: string;
  tempoCriacaoHr: string;
}

/** Modelo flat para o formulário */
export interface ArtesanatoFormViewModel {
  id?: string;
  usuarioId?: string;
  artesaoId?: string;
  imagens: (File | string)[];
  tituloArtesanato: string;
  descricaoArtesanato: string;
  sobEncomenda: boolean;
  aceitaEncomenda: boolean;
  categoriaTags: string[];
  preco: number;
  quantidadeArtesanato: number;
  materiaisUtilizados: string;
  tempoCriacaoHr: string;
}

export const defaultArtesanatoForm: ArtesanatoFormViewModel = {
  imagens: [],
  tituloArtesanato: "",
  descricaoArtesanato: "",
  sobEncomenda: false,
  aceitaEncomenda: false,
  categoriaTags: [],
  preco: 0,
  quantidadeArtesanato: 0,
  materiaisUtilizados: "",
  tempoCriacaoHr: new Date().toTimeString().slice(0, 5),
};
