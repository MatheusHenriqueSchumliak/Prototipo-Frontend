import type { ArtesaoDTO, ArtesaoFormViewModel } from "../types";

/** ArtesaoDTO (nested) → ArtesaoFormViewModel (flat) */
export function dtoToViewModel(dto: ArtesaoDTO): ArtesaoFormViewModel {
  return {
    id: dto.id,
    usuarioId: dto.usuarioId,
    fotoUrl: dto.fotoUrl,
    nomeArtesao: dto.nomeArtesao ?? "",
    descricaoPerfil: dto.descricaoPerfil ?? "",
    nichoAtuacao: dto.nichoAtuacao ?? "",
    receberEncomendas: dto.receberEncomendas,
    enviaEncomendas: dto.enviaEncomendas,
    localFisico: dto.localFisico,
    feiraMunicipal: dto.feiraMunicipal,
    // Pessoa
    nomeCompleto: dto.pessoa?.nomeCompleto ?? "",
    idade: dto.pessoa?.idade ?? 0,
    // Contato
    telefone: dto.pessoa?.contato?.telefone ?? "",
    whatsApp: dto.pessoa?.contato?.whatsApp ?? "",
    email: dto.pessoa?.contato?.email ?? "",
    instagram: dto.pessoa?.contato?.instagram ?? "",
    facebook: dto.pessoa?.contato?.facebook ?? "",
    // Endereco
    cep: dto.pessoa?.endereco?.cep ?? "",
    estado: dto.pessoa?.endereco?.estado ?? "",
    cidade: dto.pessoa?.endereco?.cidade ?? "",
    rua: dto.pessoa?.endereco?.rua ?? "",
    bairro: dto.pessoa?.endereco?.bairro ?? "",
    complemento: dto.pessoa?.endereco?.complemento ?? "",
    numero: dto.pessoa?.endereco?.numero ?? "",
    semNumero: dto.pessoa?.endereco?.semNumero ?? false,
    imagem: null,
  };
}

/** ArtesaoFormViewModel (flat) → FormData (for API multipart/form-data) */
export function viewModelToFormData(vm: ArtesaoFormViewModel): FormData {
  const formData = new FormData();

  if (vm.id) formData.append("Id", vm.id);
  if (vm.usuarioId) formData.append("UsuarioId", vm.usuarioId);
  formData.append("NomeArtesao", vm.nomeArtesao);
  formData.append("DescricaoPerfil", vm.descricaoPerfil);
  formData.append("NichoAtuacao", vm.nichoAtuacao);
  formData.append("ReceberEncomendas", String(vm.receberEncomendas));
  formData.append("EnviaEncomendas", String(vm.enviaEncomendas));
  formData.append("LocalFisico", String(vm.localFisico));
  formData.append("FeiraMunicipal", String(vm.feiraMunicipal));
  // Pessoa
  formData.append("NomeCompleto", vm.nomeCompleto);
  formData.append("Idade", String(vm.idade));
  // Contato
  formData.append("Telefone", vm.telefone);
  formData.append("WhatsApp", vm.whatsApp);
  formData.append("Email", vm.email);
  formData.append("Instagram", vm.instagram);
  formData.append("Facebook", vm.facebook);
  // Endereco
  formData.append("Cep", vm.cep);
  formData.append("Estado", vm.estado);
  formData.append("Cidade", vm.cidade);
  formData.append("Rua", vm.rua);
  formData.append("Bairro", vm.bairro);
  formData.append("Complemento", vm.complemento);
  formData.append("Numero", vm.numero);
  formData.append("SemNumero", String(vm.semNumero));

  if (vm.imagem instanceof File) {
    formData.append("imagemPerfil", vm.imagem);
  }

  return formData;
}
