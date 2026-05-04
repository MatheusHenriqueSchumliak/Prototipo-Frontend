import type { ArtesanatoDTO, ArtesanatoFormViewModel } from "../types";

/** ArtesanatoDTO → ArtesanatoFormViewModel */
export function dtoToViewModel(dto: ArtesanatoDTO): ArtesanatoFormViewModel {
  return {
    id: dto.id,
    usuarioId: dto.usuarioId,
    artesaoId: dto.artesaoId,
    imagens: dto.imagemUrl ?? [],
    tituloArtesanato: dto.tituloArtesanato ?? "",
    descricaoArtesanato: dto.descricaoArtesanato ?? "",
    sobEncomenda: dto.sobEncomenda,
    aceitaEncomenda: dto.aceitaEncomenda,
    categoriaTags: dto.categoriaTags ?? [],
    preco: dto.preco,
    quantidadeArtesanato: dto.quantidadeArtesanato,
    materiaisUtilizados: dto.materiaisUtilizados ?? "",
    tempoCriacaoHr: dto.tempoCriacaoHr ?? "",
  };
}

/** ArtesanatoFormViewModel → FormData */
export function viewModelToFormData(vm: ArtesanatoFormViewModel): FormData {
  const formData = new FormData();

  if (vm.id) formData.append("Id", vm.id);
  if (vm.usuarioId) formData.append("UsuarioId", vm.usuarioId);
  if (vm.artesaoId) formData.append("ArtesaoId", vm.artesaoId);
  formData.append("TituloArtesanato", vm.tituloArtesanato);
  formData.append("DescricaoArtesanato", vm.descricaoArtesanato);
  formData.append("SobEncomenda", String(vm.sobEncomenda));
  formData.append("AceitaEncomenda", String(vm.aceitaEncomenda));
  formData.append("Preco", String(vm.preco));
  formData.append("QuantidadeArtesanato", String(vm.quantidadeArtesanato));
  formData.append("MateriaisUtilizados", vm.materiaisUtilizados);
  formData.append("TempoCriacaoHr", vm.tempoCriacaoHr);

  vm.categoriaTags.forEach((tag, i) => {
    formData.append(`CategoriaTags[${i}]`, tag);
  });

  vm.imagens.forEach((img) => {
    if (img instanceof File) {
      formData.append("imagem", img);
    }
  });

  return formData;
}
