import { useNavigate } from "react-router-dom";
import ArtesaoForm from "../components/ArtesaoForm";
import { useArtesaoForm } from "../hooks/useArtesaoForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CadastrarArtesaoPage() {
  const navigate = useNavigate();
  const {
    form,
    updateField,
    handleCepBlur,
    submitCadastro,
    isCadastrando,
  } = useArtesaoForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.imagem) {
      MySwal.fire({
        title: "Atenção!",
        html: "Por favor, adicione pelo menos uma imagem do artesão.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    try {
      const result = await submitCadastro();
      MySwal.fire({
        title: "Sucesso!",
        html: "Artesão cadastrado com sucesso!",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate(`/exibir-artesao/${result.id}`);
      });
    } catch (error: unknown) {
      MySwal.fire({
        title: "Erro!",
        html: (error as Error)?.message ?? "Erro ao cadastrar artesão.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <ArtesaoForm
      form={form}
      onFieldChange={updateField}
      onCepBlur={handleCepBlur}
      onSubmit={handleSubmit}
      isSubmitting={isCadastrando}
    />
  );
}
