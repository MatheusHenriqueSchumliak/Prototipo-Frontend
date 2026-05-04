import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ArtesaoForm from "../components/ArtesaoForm";
import { useArtesao } from "../hooks/useArtesao";
import { useArtesaoForm } from "../hooks/useArtesaoForm";
import { dtoToViewModel } from "../mappers/artesaoMapper";
import { Loader, Text } from "@mantine/core";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function EditarArtesaoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artesaoDto, isLoading, error } = useArtesao(id);

  const {
    form,
    setForm,
    updateField,
    handleCepBlur,
    submitAtualizar,
    isAtualizando,
  } = useArtesaoForm();

  useEffect(() => {
    if (artesaoDto) {
      setForm(dtoToViewModel(artesaoDto));
    }
  }, [artesaoDto, setForm]);

  if (isLoading) return <Loader size="xl" />;
  if (error) return <Text c="red">Erro ao carregar dados do artesão.</Text>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const result = await submitAtualizar(id);
      MySwal.fire({
        title: "Sucesso!",
        html: "Artesão atualizado com sucesso!",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate(`/exibir-artesao/${result.id}`);
      });
    } catch (err: unknown) {
      MySwal.fire({
        title: "Erro!",
        html: (err as Error)?.message ?? "Erro ao atualizar artesão.",
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
      isSubmitting={isAtualizando}
    />
  );
}
