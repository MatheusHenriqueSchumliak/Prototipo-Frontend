import { ArtesaoModel, defaultArtesao } from "../../models/ArtesaoModel";
import ArtesaoForm from "../../components/ArtesaoForm";

export default function CadastrarArtesao() {
  const initialArtesao = { ...defaultArtesao };

  const handleSubmit = (artesaoAtualizado: ArtesaoModel) => {
    console.log("Cadastro ARTESÃO:", artesaoAtualizado);
  };

  return <ArtesaoForm artesao={initialArtesao} onSubmit={handleSubmit} />;
}
