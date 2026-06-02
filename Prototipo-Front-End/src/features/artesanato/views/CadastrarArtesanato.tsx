import ArtesanatoForm from "../../components/ArtesanatoForm";
import { ArtesanatoModel } from "../../models/ArtesanatoModel";
export default function CadastrarArtesanato() {
  return <ArtesanatoForm onSubmit={(artesanatoAtualizado: ArtesanatoModel) => {
    console.log("Artesanato atualizado:", artesanatoAtualizado);
  }} />;
}
