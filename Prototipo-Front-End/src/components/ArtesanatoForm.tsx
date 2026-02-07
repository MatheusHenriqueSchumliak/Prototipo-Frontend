import {
  ArtesanatoFormProps,
  ArtesanatoModel,
  getHoraAtual,
} from "../models/ArtesanatoModel";
import { cadastrarArtesanato } from "../services/ArtesanatoService";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/Api";
import { useEffect, useState } from "react";
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
  Group,
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
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const ArtesanatoForm: React.FC<ArtesanatoFormProps> = ({
  artesanato = {} as ArtesanatoModel,
}) => {
  const navigate = useNavigate();
  const artesanatoId = crypto.randomUUID();
  const { id } = useParams<{ id?: string }>();
  const [, setErrorMessage] = useState<string>("");
  const artesaoIdFromParams = id?.startsWith("id=") ? id.split("=")[1] : id;
  const artesaoId =
    artesaoIdFromParams || localStorage.getItem("ArtesaoId") || "";
  const usuarioId = localStorage.getItem("usuarioId");
  const MySwal = withReactContent(Swal);
  const [artesanatoState, setArtesanatoState] = useState<ArtesanatoModel>({
    ...artesanato,
    Id: artesanatoId,
    UsuarioId: usuarioId || "00cb252e-0310-41fe-8014-3549e7fa2b3f",
    ArtesaoId: artesaoId,
    ImagemUrl: artesanato.ImagemUrl || [],
    Imagem: artesanato.Imagem || [],
    SobEncomenda: artesanato.SobEncomenda || false,
    AceitaEncomenda: artesanato.AceitaEncomenda || false,
    TituloArtesanato: artesanato.TituloArtesanato || "",
    CategoriaTags: artesanato.CategoriaTags || [],
    DescricaoArtesanato: artesanato.DescricaoArtesanato || "",
    MateriaisUtilizados: artesanato.MateriaisUtilizados || "",
    Preco: artesanato.Preco || 0,
    QuantidadeArtesanato: artesanato.QuantidadeArtesanato || 0,
    DataCriacao: artesanato.DataCriacao || new Date(),
    TempoCriacaoHr: getHoraAtual(),
  });

  const [artesaoSelecionado, setArtesaoSelecionado] =
    useState<string>(artesaoId);

  const compressImage = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number
  ): Promise<File | null> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          const width = img.width;
          const height = img.height;

          // Calcula a nova largura e altura mantendo a proporção da imagem
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          const newWidth = width * ratio;
          const newHeight = height * ratio;

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                });
                resolve(compressedFile);
              } else {
                reject("Erro ao compactar a imagem.");
              }
            },
            file.type,
            quality
          );
        } else {
          reject("Não foi possível obter o contexto do canvas.");
        }
      };

      img.onerror = () => {
        reject("Erro ao carregar a imagem.");
      };
    });
  };

  const handleFilesChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const fileReaders: Promise<File | null>[] = Array.from(files).map(
        (file) => {
          return compressImage(file, 800, 800, 0.7) // Ajuste o tamanho máximo e a qualidade
            .then((compressedImage) => {
              return compressedImage as File | null; // Garante que o retorno seja File ou null
            })
            .catch((error) => {
              console.error("Erro ao compactar a imagem:", error);
              return null; // Retorna null em caso de erro
            });
        }
      );

      // Após a compactação, atualiza o estado com todos os arquivos compactados
      Promise.all(fileReaders)
        .then((compressedFiles) => {
          // Filtra os arquivos válidos
          const validFiles = compressedFiles.filter(
            (file) => file !== null
          ) as File[];
          // Atualiza o estado com todas as imagens válidas
          setArtesanatoState({ ...artesanatoState, Imagem: validFiles });
        })
        .catch((error) => console.error("Erro ao carregar imagens:", error));
    } else {
      setArtesanatoState({ ...artesanatoState, ImagemUrl: [] }); // Define como array vazio se não houver arquivos
    }
  };

  const handleChange = (
    value: string | boolean | string[] | number,
    id: string
  ) => {
    setArtesanatoState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  type Artesao = { Id: string; NomeArtesao: string };
  const [listaDeArtesaos, setListaDeArtesaos] = useState<Artesao[]>([]);

  useEffect(() => {
    async function fetchArtesaos() {
      try {
        const response = await apiRequest(
          "artesao/BuscarTodos",
          undefined,
          "GET"
        );

        if (Array.isArray(response)) {
          setListaDeArtesaos(response);
          console.log("Artesãos carregados (array):", response);
        } else if (response && typeof response === "object") {
          // Se recebeu um objeto único, coloque em um array
          setListaDeArtesaos([response] as Artesao[]);
          console.log("Artesão único convertido para array:", [response]);
        } else {
          console.warn("Resposta inesperada:", response);
          setListaDeArtesaos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar artesãos:", error);
        setListaDeArtesaos([]);
      }
    }

    fetchArtesaos();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // ✅ Validações básicas
      if (!artesaoSelecionado) {
        MySwal.fire({
          title: <strong>Atenção!</strong>,
          html: (
            <text>Por favor, selecione um artesão antes de cadastrar.</text>
          ),
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }

      if (!artesanatoState.Imagem || artesanatoState.Imagem.length === 0) {
        MySwal.fire({
          title: <strong>Atenção!</strong>,
          html: (
            <text>
              Por favor, adicione pelo menos uma imagem do artesanato.
            </text>
          ),
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }

      const artesanatoParaEnvio: ArtesanatoModel = {
        ...artesanatoState,
        ArtesaoId: artesaoSelecionado,
        DataCriacao: new Date(),
      };

      const artesanatoCadastrado = await cadastrarArtesanato(
        artesanatoParaEnvio
      );

      MySwal.fire({
        title: <strong>Sucesso!</strong>,
        html: <text>Artesanato cadastrado com sucesso!</text>,
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate(`/ExibirArtesanato/${artesanatoCadastrado.Id}`);
      });
    } catch (error: any) {
      if (error.message) {
        setErrorMessage(error.message);
        MySwal.fire({
          title: <strong>Erro ao cadastrar:</strong>,
          html: <text>{error.message}</text>,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        setErrorMessage("Erro desconhecido ao cadastrar artesanato");
        MySwal.fire({
          title: <strong>Erro desconhecido:</strong>,
          html: (
            <text>
              Erro desconhecido ao cadastrar artesanato. Tente novamente.
            </text>
          ),
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
    if (value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      return (
        <Pill.Group>
          {value.map((file, index) => (
            <Pill key={index}>{file.name}</Pill>
          ))}
        </Pill.Group>
      );
    }

    return <Pill>{value.name}</Pill>;
  };

  return (
    <section>
      <Container>
        <Center>
          <Title>Cadastrar Artesanato</Title>
        </Center>
        <Center>
          <form onSubmit={handleSubmit}>
            <Fieldset legend="Informações do Artesanato">
              <Center>
                <List>
                  <List.Item>Limite de 4 fotos.</List.Item>
                  <List.Item>Formato e peso: JPEG e PNG de até 10MB.</List.Item>
                </List>
              </Center>
              <Select
                data={listaDeArtesaos
                  .filter((artesao) => artesao.Id && artesao.NomeArtesao)
                  .map((artesao) => ({
                    value: artesao.Id,
                    label: artesao.NomeArtesao,
                  }))}
                label="Artesão"
                placeholder="Selecione um artesão"
                searchable
                nothingFoundMessage="Nenhum resultado encontrado"
                onChange={(value: string | null) =>
                  setArtesaoSelecionado(value || "")
                }
                radius="md"
              />
              <SimpleGrid cols={2}>
                <FileInput
                  id="Imagem"
                  label="Selecione os arquivos"
                  placeholder="Selecione até 4 arquivos"
                  onChange={(files) =>
                    handleFilesChange(files as File[] | null)
                  }
                  valueComponent={ValueComponent}
                  multiple={true}
                  accept="image/png,image/jpeg"
                />
              </SimpleGrid>
              <Center>
                <Group mt="md">
                  <SimpleGrid cols={4} spacing="sm">
                    {Array.isArray(artesanatoState.Imagem) &&
                    artesanatoState.Imagem.length > 0 ? (
                      artesanatoState.Imagem.map((img, index) => {
                        const src =
                          img instanceof File ? URL.createObjectURL(img) : img;
                        return (
                          <Avatar
                            variant="filled"
                            radius="sm"
                            size="xl"
                            key={index}
                            src={src}
                            alt={`Imagem ${index + 1}`}
                          />
                        );
                      })
                    ) : (
                      <p>Nenhuma imagem disponível</p>
                    )}
                  </SimpleGrid>
                </Group>
              </Center>

              <Divider label="Características do artesanato" mt="sm" />
              <SimpleGrid cols={2}>
                <Checkbox
                  id="SobEncomenda"
                  mt="sm"
                  mb="sm"
                  checked={artesanatoState.SobEncomenda}
                  onChange={(e) =>
                    handleChange(e.target.checked, "SobEncomenda")
                  }
                  label="Este trabalho é feito somente sob encomenda."
                />
                <Checkbox
                  id="AceitaEncomenda"
                  mt="sm"
                  mb="sm"
                  checked={artesanatoState.AceitaEncomenda}
                  onChange={(e) =>
                    handleChange(e.target.checked, "AceitaEncomenda")
                  }
                  label="Aceita encomenda deste trabalho."
                />
              </SimpleGrid>
              <TagsInput
                id="categoriaTags"
                label="Adicione a categoria deste artesanato:"
                description="Adicione até 3 tags"
                placeholder="Insira a tag"
                maxTags={5}
                defaultValue={["Crochê", "Macramê"]}
                onChange={(tags) => handleChange(tags, "categoriaTags")}
              />
              <Grid>
                <Grid.Col span={6}>
                  {" "}
                  {/* Título ocupa metade da largura */}
                  <TextInput
                    radius="md"
                    label="Título do artesanato:"
                    placeholder="Título do artesanato"
                    type="text"
                    id="TituloArtesanato"
                    onChange={(e) =>
                      handleChange(e.target.value, "TituloArtesanato")
                    }
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  {" "}
                  {/* Preço ocupa 1/6 da largura */}
                  <NumberInput
                    radius="md"
                    label="Preço:"
                    placeholder="R$:"
                    id="Preco"
                    onChange={(value) => handleChange(value, "Preco")}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  {" "}
                  {/* Quantidade ocupa 1/6 da largura */}
                  <NumberInput
                    radius="md"
                    label="Quantidade:"
                    placeholder={
                      artesanatoState.SobEncomenda
                        ? "Trabalho sob encomenda"
                        : "Quantidade possui em estoque"
                    }
                    id="QuantidadeArtesanato"
                    onChange={(value) =>
                      handleChange(value, "QuantidadeArtesanato")
                    }
                    value={artesanatoState.QuantidadeArtesanato || undefined}
                    disabled={artesanatoState.SobEncomenda}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  {" "}
                  {/* Tempo ocupa 1/6 da largura */}
                  <NumberInput
                    radius="md"
                    label="Tempo de produção:"
                    placeholder="Em horas"
                    id="TempoCriacaoHr"
                    onChange={(value) => handleChange(value, "TempoCriacaoHr")}
                    decimalScale={2}
                  />
                </Grid.Col>
              </Grid>
              <TextInput
                radius="md"
                label="Materiais utilizados:"
                placeholder="Ex: Algodão, Madeira, Tecido..."
                id="MateriaisUtilizados"
                onChange={(e) =>
                  handleChange(e.target.value, "MateriaisUtilizados")
                }
              />
              <Textarea
                radius="md"
                label="Descrição do produto:"
                placeholder="Detalhes sobre o produto, processo criativo..."
                id="DescricaoArtesanato"
                rows={4}
                onChange={(e) =>
                  handleChange(e.target.value, "DescricaoArtesanato")
                }
              />
              
              <Button m="sm" type="submit" radius="md" color="red">
                Voltar
              </Button>
              <Button type="submit" radius="md" color="green">
                Salvar
              </Button>
            </Fieldset>
          </form>
        </Center>
      </Container>
    </section>
  );
};

export default ArtesanatoForm;
