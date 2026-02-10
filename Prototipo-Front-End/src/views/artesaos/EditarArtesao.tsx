import {
  atualizaArtesao,
  buscarArtesaoPorId,
} from "../../services/ArtesaoService";
import { useNavigate, useParams } from "react-router-dom";
import { ArtesaoModel } from "../../models/ArtesaoModel";
import ArtesaoForm from "../../components/ArtesaoForm"; // Reaproveitando o ArtesaoForm
import { useEffect, useState } from "react";

const EditarArtesao: React.FC = () => {
  const [artesao, setArtesao] = useState<ArtesaoModel | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchArtesao = async () => {
        try {
          const artesaoData = await buscarArtesaoPorId(id);
          setArtesao(artesaoData);
        } catch (error: any) {
          setErrorMessage("Erro ao carregar dados do artesão.");
          console.error("Erro ao carregar artesão:", error);
        }
      };

      fetchArtesao();
    }
  }, [id]);

  const handleSubmit = async (updatedArtesao: ArtesaoModel) => {
    if (!id) return;

    const formData = new FormData();
    formData.append("id", updatedArtesao.id || "");
    formData.append("nomeArtesao", updatedArtesao.nomeArtesao || "");
    formData.append("telefone", updatedArtesao.telefone || "");
    formData.append("whatsApp", updatedArtesao.whatsApp || "");
    formData.append("descricaoPerfil", updatedArtesao.descricaoPerfil || "");
    formData.append("usuarioId", updatedArtesao.usuarioId || "");
    formData.append(
      "receberEncomendas",
      updatedArtesao.receberEncomendas?.toString() || "false"
    );
    formData.append(
      "enviaEncomendas",
      updatedArtesao.enviaEncomendas?.toString() || "false"
    );
    formData.append("cep", updatedArtesao.cep || "");
    formData.append("estado", updatedArtesao.estado || "" );
    formData.append("cidade", updatedArtesao.cidade || "");
    formData.append("rua", updatedArtesao.rua || "");
    formData.append("bairro", updatedArtesao.bairro || "");
    formData.append("complemento", updatedArtesao.complemento || "");
    formData.append("numero", updatedArtesao.numero || "");
    formData.append("semNumero", updatedArtesao.semNumero?.toString() || "false");

    if (
      updatedArtesao.imagem &&
      updatedArtesao.imagem instanceof File
    ) {
      formData.append("imagemPerfil", updatedArtesao.imagem);
    }

    try {
      const data = await atualizaArtesao(id, formData);
      console.log("Artesão atualizado com sucesso:", data);
      alert("Artesão atualizado com sucesso!");
      navigate(`/ExibirArtesao/${data.id}`); // Redireciona usando o ID correto
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Erro ao atualizar o artesão:", error);
    }
  };

  return (
    <div>
      {artesao ? (
        <ArtesaoForm artesao={artesao} onSubmit={handleSubmit} />
      ) : (
        <p>Carregando dados do artesão...</p>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default EditarArtesao;
