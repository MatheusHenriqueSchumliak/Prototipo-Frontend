import {
  Avatar,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Fieldset,
  FileInput,
  FileInputProps,
  Grid,
  List,
  NumberInput,
  Pill,
  Select,
  SimpleGrid,
  TagsInput,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import type { ArtesanatoFormViewModel } from "../types";
import type { ArtesaoDTO } from "../../artesao/types";

interface ArtesanatoFormProps {
  form: ArtesanatoFormViewModel;
  artesaos: ArtesaoDTO[];
  onFieldChange: <K extends keyof ArtesanatoFormViewModel>(
    field: K,
    value: ArtesanatoFormViewModel[K]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const compressImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<File | null> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject("Sem contexto canvas"); return; }
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(new File([blob], file.name, { type: file.type }));
          else reject("Erro ao compactar imagem");
        },
        file.type,
        quality
      );
    };
    img.onerror = () => reject("Erro ao carregar imagem");
  });

const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
  if (value === null) return null;
  if (Array.isArray(value))
    return (
      <Pill.Group>
        {value.map((f, i) => (
          <Pill key={i}>{f.name}</Pill>
        ))}
      </Pill.Group>
    );
  return <Pill>{value.name}</Pill>;
};

export default function ArtesanatoForm({
  form,
  artesaos,
  onFieldChange,
  onSubmit,
  isSubmitting = false,
}: ArtesanatoFormProps) {
  const handleFilesChange = async (files: File[] | null) => {
    if (!files?.length) { onFieldChange("imagens", []); return; }
    const compressed = await Promise.all(
      files.map((f) => compressImage(f, 800, 800, 0.7).catch(() => null))
    );
    onFieldChange("imagens", compressed.filter((f): f is File => f !== null));
  };

  return (
    <section>
      <Container>
        <Center>
          <Title>Cadastrar Artesanato</Title>
        </Center>
        <Center>
          <form onSubmit={onSubmit}>
            <Fieldset legend="Informações do Artesanato">
              <Center>
                <List>
                  <List.Item>Limite de 4 fotos.</List.Item>
                  <List.Item>Formato: JPEG e PNG de até 10MB.</List.Item>
                </List>
              </Center>

              <Select
                data={artesaos.map((a) => ({
                  value: a.id,
                  label: a.nomeArtesao ?? a.pessoa?.nomeCompleto ?? a.id,
                }))}
                label="Artesão"
                placeholder="Selecione um artesão"
                value={form.artesaoId ?? null}
                onChange={(v) => onFieldChange("artesaoId", v ?? undefined)}
                searchable
                nothingFoundMessage="Nenhum resultado encontrado"
                radius="md"
              />

              <SimpleGrid cols={2}>
                <FileInput
                  label="Selecione os arquivos"
                  placeholder="Até 4 arquivos"
                  onChange={(files) => handleFilesChange(files as File[] | null)}
                  valueComponent={ValueComponent}
                  multiple
                  accept="image/png,image/jpeg"
                />
              </SimpleGrid>

              <Center>
                <SimpleGrid cols={4} spacing="sm" mt="md">
                  {form.imagens.length > 0 ? (
                    form.imagens.map((img, index) => (
                      <Avatar
                        key={index}
                        variant="filled"
                        radius="sm"
                        size="xl"
                        src={img instanceof File ? URL.createObjectURL(img) : img}
                        alt={`Imagem ${index + 1}`}
                      />
                    ))
                  ) : (
                    <p>Nenhuma imagem selecionada</p>
                  )}
                </SimpleGrid>
              </Center>

              <Divider label="Características do artesanato" mt="sm" />

              <SimpleGrid cols={2}>
                <Checkbox
                  mt="sm"
                  mb="sm"
                  checked={form.sobEncomenda}
                  onChange={(e) => onFieldChange("sobEncomenda", e.target.checked)}
                  label="Este trabalho é feito somente sob encomenda."
                />
                <Checkbox
                  mt="sm"
                  mb="sm"
                  checked={form.aceitaEncomenda}
                  onChange={(e) =>
                    onFieldChange("aceitaEncomenda", e.target.checked)
                  }
                  label="Aceita encomenda deste trabalho."
                />
              </SimpleGrid>

              <TagsInput
                label="Categorias do artesanato:"
                description="Adicione até 5 tags"
                placeholder="Insira a tag"
                maxTags={5}
                value={form.categoriaTags}
                onChange={(tags) => onFieldChange("categoriaTags", tags)}
              />

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    radius="md"
                    label="Título do artesanato:"
                    placeholder="Título"
                    value={form.tituloArtesanato}
                    onChange={(e) =>
                      onFieldChange("tituloArtesanato", e.target.value)
                    }
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    radius="md"
                    label="Preço:"
                    placeholder="R$:"
                    value={form.preco}
                    onChange={(v) => onFieldChange("preco", Number(v))}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    radius="md"
                    label="Quantidade:"
                    placeholder={
                      form.sobEncomenda
                        ? "Sob encomenda"
                        : "Estoque disponível"
                    }
                    value={form.quantidadeArtesanato}
                    onChange={(v) =>
                      onFieldChange("quantidadeArtesanato", Number(v))
                    }
                    disabled={form.sobEncomenda}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    radius="md"
                    label="Tempo de produção (h):"
                    placeholder="Em horas"
                    value={Number(form.tempoCriacaoHr) || ""}
                    onChange={(v) => onFieldChange("tempoCriacaoHr", String(v))}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                radius="md"
                label="Materiais utilizados:"
                placeholder="Ex: Algodão, Madeira..."
                value={form.materiaisUtilizados}
                onChange={(e) =>
                  onFieldChange("materiaisUtilizados", e.target.value)
                }
              />

              <Textarea
                radius="md"
                label="Descrição do produto:"
                placeholder="Detalhes sobre o produto..."
                rows={4}
                value={form.descricaoArtesanato}
                onChange={(e) =>
                  onFieldChange("descricaoArtesanato", e.target.value)
                }
              />

              <Button type="submit" radius="md" color="green" mt="sm" loading={isSubmitting}>
                Salvar
              </Button>
            </Fieldset>
          </form>
        </Center>
      </Container>
    </section>
  );
}
