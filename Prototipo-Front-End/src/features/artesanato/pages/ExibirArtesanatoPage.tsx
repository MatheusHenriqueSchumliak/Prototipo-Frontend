import { useParams, Link } from "react-router-dom";
import {
  Container,
  Center,
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
  Loader,
} from "@mantine/core";
import { TbArrowLeft, TbCategory, TbUser, TbZoomIn } from "react-icons/tb";
import { Carousel } from "@mantine/carousel";
import { useQuery } from "@tanstack/react-query";
import { buscarArtesanatoPorId } from "../api/artesanatoApi";
import { buscarArtesaoPorId } from "../../artesao/api/artesaoApi";
import ArtesanatoCard from "../components/ArtesanatoCard";
import { useArtesanatosPorArtesao } from "../hooks/useArtesanatos";
import WhatsAppLink from "../../../shared/components/WhatsAppLink";

export default function ExibirArtesanatoPage() {
  const { id } = useParams<{ id?: string }>();
  const artesanatoId = id?.startsWith("id=") ? id.split("=")[1] : id;

  const { data: artesanato, isLoading, error } = useQuery({
    queryKey: ["artesanato", artesanatoId],
    queryFn: () => buscarArtesanatoPorId(artesanatoId!),
    enabled: !!artesanatoId,
  });

  const { data: artesao } = useQuery({
    queryKey: ["artesao", artesanato?.artesaoId],
    queryFn: () => buscarArtesaoPorId(artesanato!.artesaoId),
    enabled: !!artesanato?.artesaoId,
  });

  const { data: artesanatos = [] } = useArtesanatosPorArtesao(artesanato?.artesaoId);

  if (isLoading) return <Loader size="xl" />;
  if (error || !artesanato)
    return (
      <Center>
        <Text>Carregando informações do artesanato...</Text>
      </Center>
    );

  const numeroTelefone = artesao?.pessoa?.contato?.telefone?.replace(/\D/g, "");
  const numeroWhatsApp = `+55${numeroTelefone}`;
  const mensagem = `Olá, estou interessado no artesanato "${artesanato.tituloArtesanato}". Ainda disponível?`;

  return (
    <section>
      <Container>
        <Flex
          justify="space-between"
          align="center"
          direction="row"
          wrap="wrap"
          mt="lg"
          py="lg"
        >
          <Button
            variant="outline"
            color="blue"
            size="sm"
            component={Link}
            to="/listar-artesanatos"
            leftSection={<TbArrowLeft size={16} />}
          >
            Ver todos os artesanatos
          </Button>

          <Button
            variant="filled"
            color="blue"
            size="sm"
            component={Link}
            to={`/exibir-artesao/${artesanato.artesaoId}`}
            leftSection={<TbUser size={16} />}
            disabled={!artesao}
          >
            {artesao
              ? `Perfil de ${artesao.nomeArtesao?.split(" ")[0]}`
              : "Carregando perfil..."}
          </Button>
        </Flex>

        <Text component="h1" size="2rem" ta="center" mb="xl" fw={700}>
          {artesanato.tituloArtesanato}
        </Text>

        <Carousel withIndicators slideSize="100%" slideGap="md" loop align="start">
          {artesanato.imagemUrl?.map((url, index) => (
            <Carousel.Slide key={index}>
              <div style={{ position: "relative" }}>
                <Image
                  p="sm"
                  src={url}
                  alt={`Imagem ${index + 1} de ${artesanato.tituloArtesanato}`}
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
                    backgroundColor: "rgba(255,255,255,0.9)",
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

        <Stack mb="xl">
          <Group grow>
            {artesanato.sobEncomenda && (
              <Paper p="sm" bg="yellow.0" radius="md">
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
              >
                <Text size="sm" fw={500} c={artesanato.quantidadeArtesanato > 0 ? "blue.7" : "red.7"} ta="center">
                  📦{" "}
                  {artesanato.quantidadeArtesanato > 0
                    ? `${artesanato.quantidadeArtesanato} em estoque`
                    : "Sem estoque"}
                </Text>
              </Paper>
            )}
            {artesanato.aceitaEncomenda && (
              <Paper p="sm" bg="orange.0" radius="md">
                <Text size="sm" fw={500} c="orange.7" ta="center">
                  ✅ Aceita encomenda
                </Text>
              </Paper>
            )}
            {artesanato.preco > 0 && (
              <Paper p="sm" bg="green.0" radius="md">
                <Text size="sm" fw={500} c="green.7" ta="center">
                  💰 R$ {artesanato.preco.toFixed(2)}
                </Text>
              </Paper>
            )}
          </Group>

          {artesanato.categoriaTags?.length > 0 && (
            <Box>
              <Flex justify="space-between" align="baseline" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  🏷️ Categorias:
                </Text>
                <Text size="sm" c="dimmed" fw={500}>
                  💬 Entre em contato com o artesão
                </Text>
              </Flex>
              <Flex justify="space-between" align="center" gap="md" wrap="wrap">
                <Flex gap="md" wrap="wrap" flex="1">
                  {artesanato.categoriaTags.map((tag, index) => (
                    <Badge key={index} variant="default" size="lg" radius="md" leftSection={<TbCategory size={16} />}>
                      {tag}
                    </Badge>
                  ))}
                </Flex>
                <WhatsAppLink telefone={numeroWhatsApp} mensagem={mensagem} />
              </Flex>
            </Box>
          )}
        </Stack>

        <Stack gap="lg">
          <Box pl="lg" style={{ borderLeft: "3px solid var(--mantine-color-blue-5)" }}>
            <Text fw={500} size="lg" mb="sm">
              Descrição
            </Text>
            <Text size="md" ta="justify" c="dimmed">
              {artesanato.descricaoArtesanato}
            </Text>
          </Box>
          <Box pr="lg" style={{ borderRight: "3px solid var(--mantine-color-green-5)" }}>
            <Text fw={500} size="lg" mb="sm">
              Materiais Utilizados
            </Text>
            <Text size="md" ta="justify" c="dimmed">
              {artesanato.materiaisUtilizados}
            </Text>
          </Box>
        </Stack>

        <Title order={2} mt="md" mb={30} ta="center">
          Mais trabalhos do Artesão
        </Title>

        <Grid mt="md" mb="md" justify="center">
          {artesanatos.filter((a) => a.id !== artesanato.id).length > 0 ? (
            artesanatos
              .filter((a) => a.id !== artesanato.id)
              .map((item, index) => (
                <Grid.Col
                  span={4}
                  key={`${item.id}-${index}`}
                  style={{ display: "flex", flex: 1 }}
                >
                  <ArtesanatoCard artesanato={item} />
                </Grid.Col>
              ))
          ) : (
            <Container>
              <Alert ta="center" c="dimmed">
                Nenhum outro artesanato cadastrado.
              </Alert>
            </Container>
          )}
        </Grid>
      </Container>
    </section>
  );
}
