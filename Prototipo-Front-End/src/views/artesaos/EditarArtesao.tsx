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
    formData.append("id", updatedArtesao.Id || "");
    formData.append("nomeArtesao", updatedArtesao.NomeArtesao || "");
    formData.append("telefone", updatedArtesao.Telefone || "");
    formData.append("whatsApp", updatedArtesao.WhatsApp || "");
    formData.append("descricaoPerfil", updatedArtesao.DescricaoPerfil || "");
    formData.append("usuarioId", updatedArtesao.UsuarioId || "");
    formData.append(
      "receberEncomendas",
      updatedArtesao.ReceberEncomendas?.toString() || "false"
    );
    formData.append(
      "enviaEncomendas",
      updatedArtesao.EnviaEncomendas?.toString() || "false"
    );
    formData.append("cep", updatedArtesao.CEP || "");
    formData.append("estado", updatedArtesao.Estado || "" );
    formData.append("cidade", updatedArtesao.Cidade || "");
    formData.append("rua", updatedArtesao.Rua || "");
    formData.append("bairro", updatedArtesao.Bairro || "");
    formData.append("complemento", updatedArtesao.Complemento || "");
    formData.append("numero", updatedArtesao.Numero || "");
    formData.append("semNumero", updatedArtesao.SemNumero?.toString() || "false");

    if (
      updatedArtesao.Imagem &&
      updatedArtesao.Imagem instanceof File
    ) {
      formData.append("imagemPerfil", updatedArtesao.Imagem);
    }

    try {
      const data = await atualizaArtesao(id, formData);
      console.log("Artesão atualizado com sucesso:", data);
      alert("Artesão atualizado com sucesso!");
      navigate(`/ExibirArtesao/${data.Id}`); // Redireciona usando o ID correto
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
