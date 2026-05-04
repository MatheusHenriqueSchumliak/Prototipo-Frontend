import { useNavigate } from "react-router-dom";
import ArtesanatoForm from "../components/ArtesanatoForm";
import { useArtesanatoForm } from "../hooks/useArtesanatoForm";
import { useArtesaos } from "../../artesao/hooks/useArtesaos";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CadastrarArtesanatoPage() {
  const navigate = useNavigate();
  const { form, updateField, submitCadastro, isCadastrando } = useArtesanatoForm();
  const { data: artesaos = [] } = useArtesaos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.artesaoId) {
      MySwal.fire({
        title: "Atenção!",
        html: "Por favor, selecione um artesão.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (!form.imagens.length) {
      MySwal.fire({
        title: "Atenção!",
        html: "Por favor, adicione pelo menos uma imagem.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    try {
      const result = await submitCadastro();
      MySwal.fire({
        title: "Sucesso!",
        html: "Artesanato cadastrado com sucesso!",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => navigate(`/exibir-artesanato/${result.id}`));
    } catch (err: unknown) {
      MySwal.fire({
        title: "Erro!",
        html: (err as Error)?.message ?? "Erro ao cadastrar artesanato.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <ArtesanatoForm
      form={form}
      artesaos={artesaos}
      onFieldChange={updateField}
      onSubmit={handleSubmit}
      isSubmitting={isCadastrando}
    />
  );
}
