import { ArtesaoModel } from "../../models/ArtesaoModel";
import ArtesaoForm from "../../components/ArtesaoForm";

export default function CadastrarArtesao() {
  const initialArtesao: ArtesaoModel = {
    Id: "",
    UsuarioId: "",
    NomeArtesao: "",
    Telefone: "",
    WhatsApp: "",
    DescricaoPerfil: "",
    ReceberEncomendas: false,
    EnviaEncomendas: false,
    //ImagemUrl: [],
    Imagem: null,
    CEP: "",
    Estado: "",
    Cidade: "",
    Rua: "",
    Bairro: "",
    Complemento: "",
    Numero: "",
    SemNumero: false,
    DataCadastro: new Date(),
    FotoUrl: "",
    NomeCompleto: "",
    Idade: 0,
    Email: "",
    Instagram: "",
    Facebook: "",
    NichoAtuacao: "",
    LocalFisico: false,
    FeiraMunicipal: false
  };

  const handleSubmit = (artesaoAtualizado: ArtesaoModel) => {
    console.log("Cadastro ARTESÃO:", artesaoAtualizado);
  };

  return <ArtesaoForm artesao={initialArtesao} onSubmit={handleSubmit} />;
}
