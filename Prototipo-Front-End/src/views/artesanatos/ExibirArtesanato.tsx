import {
  BuscarArtesanatoPorArtesaoId,
  BuscarArtesanatoPorId,
} from "../../services/ArtesanatoService";
import { ArtesanatoModel } from "../../models/ArtesanatoModel";
import WhatsAppLink from "../../components/WhatsAppLink";
import { Link, useParams } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import {
  Center,
  Container,
  Text,
  Image,
  Badge,
  Flex,
  ActionIcon,
  Button,
  Box,
  Group,
  Paper,
  Stack,
  Alert,
  Grid,
  Title,
} from "@mantine/core";
import { TbArrowLeft, TbCategory, TbUser, TbZoomIn } from "react-icons/tb";
import { buscarArtesaoPorId } from "../../services/ArtesaoService";
import { ArtesaoModel } from "../../models/ArtesaoModel";
import CardArtesanato from "./CardArtesanato";

export default function ExibirArtesanato() {
  const [artesao, setArtesao] = useState<ArtesaoModel | null>(null);
  const [artesanato, setArtesanato] = useState<ArtesanatoModel | null>(null);
  const [artesanatos, setArtesanatos] = useState<ArtesanatoModel[]>([]);
  const [, setErro] = useState<string | null>(null);

  const { id } = useParams<{ id?: string }>();
  // Verifica se o id é válido antes de usá-lo
  const artesanatoId = id && id.startsWith("id=") ? id.split("=")[1] : id;
  console.log("ID recebido via URL corrigido:", artesanatoId);

  useEffect(() => {
    // Faz scroll suave para o topo sempre que o ID mudar
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [artesanatoId]);

  const artesaoId = artesanato?.artesaoId;

  const numeroTelefone = artesao?.telefone?.replace(/\D/g, ""); // remove qualquer caractere não numérico
  const numeroWhatsApp = `+55${numeroTelefone}`;
  const mensagem = `Olá, estou interessado no artesanato "${artesanato?.tituloArtesanato}". Ele ainda está disponível?`;

  // Primeiro useEffect: Carrega o artesanato
  useEffect(() => {
    if (!artesanatoId) return;

    const carregarArtesanato = async () => {
      try {
        const artesanatoEncontrado = await BuscarArtesanatoPorId(artesanatoId);
        setArtesanato(artesanatoEncontrado);

        console.log(
          `ARTESANATO Encontrado: ${JSON.stringify(
            artesanatoEncontrado,
            null,
            2
          )}`
        );
      } catch (err) {
        console.log(err);
        setErro("Erro ao carregar dados do artesanato.");
      }
    };

    carregarArtesanato();
  }, [artesanatoId]);

  // Segundo useEffect: Carrega o artesão após ter o artesanato
  useEffect(() => {
    if (!artesanato?.artesaoId) return;

    const carregarArtesao = async () => {
      try {
        const artesaoEncontrado = await buscarArtesaoPorId(
          artesanato.artesaoId
        );
        setArtesao(artesaoEncontrado);

        console.log(
          `ARTESÃO Encontrado: ${JSON.stringify(artesaoEncontrado, null, 2)}`
        );
      } catch (error) {
        console.error("Erro ao carregar artesão:", error);
        setErro("Erro ao carregar dados do artesão.");
      }
    };

    const carregarArtesanatos = async () => {
      try {
        if (!artesaoId) return;

        const response = await BuscarArtesanatoPorArtesaoId(artesaoId); // Supondo que esta seja a função da API
        const artesanatos = Array.isArray(response) ? response : [response]; // Certifique-se de que seja um array
        setArtesanatos(artesanatos);

        console.log(
          `*****************Artesanatos Encontrados: ${JSON.stringify(
            artesanatos,
            null,
            2
          )}`
        );
      } catch (err) {
        console.log("Erro ao carregar os artesanatos:", err);
      }
    };

    carregarArtesanatos();
    carregarArtesao();
  }, [artesanato?.artesaoId]);

  // Renderização condicional enquanto os dados são carregados
  if (!artesanato) {
    return (
      <section>
        <Container>
          <Center>
            <Text>Carregando informações do artesanato...</Text>
          </Center>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container>
        {/* 1. NAVEGAÇÃO/BREADCRUMB - Primeiro para orientação */}
        <Flex
          justify="space-between"
          align="center"
          direction="row"
          wrap="wrap"
          mb="md"
        >
          <Button
            variant="outline"
            color="blue"
            size="sm"
            component={Link}
            to="/ListarArtesanatos"
            leftSection={<TbArrowLeft size={16} />}
          >
            Ver todos os artesanatos
          </Button>

          <Button
            variant="filled"
            color="blue"
            size="sm"
            component={Link}
            to={`/ExibirArtesao/id=${artesanato?.artesaoId}`}
            leftSection={<TbUser size={16} />}
            disabled={!artesao}
          >
            {artesao
              ? `Perfil de ${artesao?.nomeArtesao!.split(" ")[0]}`
              : "Carregando perfil..."}
          </Button>
        </Flex>
        {/* 2. TÍTULO DO ARTESANATO - Logo após navegação */}
        <Text component="h1" size="2rem" ta="center" mb="xl" fw={700}>
          {artesanato.tituloArtesanato}
        </Text>
        {/* 3. GALERIA DE IMAGENS - Elemento visual principal */}
        <Carousel
          withIndicators
          slideSize="100%"
          slideGap="md"
          loop
          align="start"
          styles={{
            control: {
              backgroundColor: "white",
              border: "2px solid var(--mantine-color-gray-4)",
              color: "var(--mantine-color-dark-6)",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "var(--mantine-color-gray-1)",
                borderColor: "var(--mantine-color-gray-6)",
              },
            },
            indicator: {
              backgroundColor: "var(--mantine-color-gray-3)",
              border: "1px solid var(--mantine-color-gray-5)",
              "&[data-active]": {
                backgroundColor: "var(--mantine-color-dark-6)",
              },
            },
          }}
        >
          {artesanato?.imagemUrl?.map((url, index) => (
            <Carousel.Slide key={index}>
              <div style={{ position: "relative" }}>
                <Image
                  p="sm"
                  id="descricaoPerfil"
                  src={url}
                  alt={`Imagem ${index + 1} do artesanato ${
                    artesanato.tituloArtesanato
                  }`}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "8px",
                  }}
                />
                <ActionIcon
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "var(--mantine-color-dark-6)",
                  }}
                  size="lg"
                  radius="xl"
                  onClick={() => window.open(url, "_blank")}
                >
                  <TbZoomIn size={20} />
                </ActionIcon>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* 4. STATUS/BADGES - Informação importante sobre disponibilidade */}
        <Stack mb="xl">
          {/* Linha principal de informações */}
          <Group grow>
            {artesanato.sobEncomenda && (
              <Paper
                p="sm"
                bg="yellow.0"
                radius="md"
                style={{ border: "1px solid var(--mantine-color-yellow-3)" }}
              >
                <Text size="sm" fw={500} c="yellow.7" ta="center">
                  📋 Somente sob encomenda
                </Text>
              </Paper>
            )}

            {!artesanato.sobEncomenda && (
              <Paper
                p="sm"
                bg={artesanato.quantidadeArtesanato > 0 ? "blue.0" : "red.0"}
                radius="md"
                style={{
                  border: `1px solid var(--mantine-color-${
                    artesanato.quantidadeArtesanato > 0 ? "blue" : "red"
                  }-3)`,
                }}
              >
                <Text
                  size="sm"
                  fw={500}
                  c={artesanato.quantidadeArtesanato > 0 ? "blue.7" : "red.7"}
                  ta="center"
                >
                  📦{" "}
                  {artesanato.quantidadeArtesanato > 0
                    ? `${artesanato.quantidadeArtesanato} em estoque`
                    : "Sem estoque"}
                </Text>
              </Paper>
            )}

            {artesanato.aceitaEncomenda && (
              <Paper
                p="sm"
                bg="orange.0"
                radius="md"
                style={{ border: "1px solid var(--mantine-color-orange-3)" }}
              >
                <Text size="sm" fw={500} c="orange.7" ta="center">
                  ✅ Aceita encomenda
                </Text>
              </Paper>
            )}

            {artesanato.preco > 0 && (
              <Paper
                p="sm"
                bg="green.0"
                radius="md"
                style={{ border: "1px solid var(--mantine-color-green-3)" }}
              >
                <Text size="sm" fw={500} c="green.7" ta="center">
                  💰 R$ {artesanato.preco.toFixed(2)}
                </Text>
              </Paper>
            )}
          </Group>

          {/* Categorias em linha separada */}
          {artesanato.categoriaTags && artesanato.categoriaTags.length > 0 && (
            <Box>
              <Flex justify="space-between" align="baseline" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  🏷️ Categorias do artesanato:
                </Text>
                <Text size="sm" c="dimmed" fw={500}>
                  💬 Entre em contato direto com artesão
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" gap="md" wrap="wrap">
                <Flex gap="md" wrap="wrap" flex="1">
                  {artesanato.categoriaTags.map((tag, index) => {
                    return (
                      <Badge
                        key={index}
                        variant="default"
                        size="lg"
                        radius="md"
                        leftSection={<TbCategory size={16} />}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </Flex>
                <WhatsAppLink telefone={numeroWhatsApp} mensagem={mensagem} />
              </Flex>
            </Box>
          )}
        </Stack>

        <Stack gap="lg">
          <Box
            pl="lg"
            style={{ borderLeft: "3px solid var(--mantine-color-blue-5)" }}
          >
            <Text fw={500} size="lg" mb="sm">
              Descrição
            </Text>
            <Text size="md" ta="justify" c="dimmed">
              {artesanato.descricaoArtesanato}
            </Text>
          </Box>

          <Box
            pr="lg"
            style={{ borderRight: "3px solid var(--mantine-color-green-5)" }}
          >
            <Text fw={500} size="lg" mb="sm">
              Materiais Utilizados
            </Text>
            <Text size="md" ta="justify" c="dimmed">
              {artesanato.materiaisUtilizados}
            </Text>
          </Box>
        </Stack>

        {/* 9. OUTROS TRABALHOS */}        
        <Title
          order={2}  
          mt="md"        
          mb={30}
          style={{
            textAlign: "center",
            fontSize: "clamp(1.5rem, 4vw, 1.75rem)",
          }}
        >
         Mais trabalhos do Artesão
        </Title>

        <Grid mt="md" mb="md" justify="center">
          {Array.isArray(artesanatos) && artesanatos.length > 0 ? (
            artesanatos
              .filter(
                (artesanatoItem) =>
                  artesanatoItem &&
                  artesanatoItem.id &&
                  artesanatoItem.id !== artesanato?.id
              ) // Filtra itens válidos
              .map((artesanatoItem, index) => (
                <Grid.Col
                  span={4}
                  key={`artesanato-${artesanatoItem.id}-${index}`}
                  style={{ display: "flex", flex: 1 }} // Adiciona flexbox e faz o card ocupar toda altura disponível
                >
                  <CardArtesanato artesanato={artesanatoItem} />
                </Grid.Col>
              ))
          ) : (
            <Container>
              <Alert ta="center" c="dimmed">
                {!Array.isArray(artesanatos)
                  ? "Erro ao carregar artesanatos"
                  : "Nenhum artesanato cadastrado."}
              </Alert>
            </Container>
          )}
        </Grid>
      </Container>
    </section>
  );
}
