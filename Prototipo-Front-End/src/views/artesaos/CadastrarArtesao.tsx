import { ArtesaoModel } from "../../models/ArtesaoModel";
import ArtesaoForm from "../../components/ArtesaoForm";

export default function CadastrarArtesao() {
  const initialArtesao: ArtesaoModel = {
    id: "",
    usuarioId: "",
    nomeArtesao: "",
    telefone: "",
    whatsApp: "",
    descricaoPerfil: "",
    receberEncomendas: false,
    enviaEncomendas: false,
    //imagemUrl: [],
    imagem: null,
    cep: "",
    estado: "",
    cidade: "",
    rua: "",
    bairro: "",
    complemento: "",
    numero: "",
    semNumero: false,
    dataCadastro: new Date(),
    fotoUrl: "",
    nomeCompleto: "",
    idade: 0,
    email: "",
    instagram: "",
    facebook: "",
    nichoAtuacao: "",
    localFisico: false,
    feiraMunicipal: false
  };

  const handleSubmit = (artesaoAtualizado: ArtesaoModel) => {
    console.log("Cadastro ARTESÃO:", artesaoAtualizado);
  };

  return <ArtesaoForm artesao={initialArtesao} onSubmit={handleSubmit} />;
}
