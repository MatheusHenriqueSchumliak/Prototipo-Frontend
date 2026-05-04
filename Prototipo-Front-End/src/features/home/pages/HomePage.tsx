import {
  Container,
  Button,
  Card,
  Flex,
  Group,
  Image,
  Text,
  SimpleGrid,
  Badge,
  Avatar,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import { useArtesanatos } from "../../artesanato/hooks/useArtesanatos";
import { useArtesaos } from "../../artesao/hooks/useArtesaos";
import ListarArtesanatosPage from "../../artesanato/pages/ListarArtesanatosPage";
import styles from "./style.module.css";

export function HomePage() {
  const { data: artesaos = [] } = useArtesaos();
  const { data: artesanatos = [] } = useArtesanatos();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const imagensArtesanatos = artesanatos
    .slice(0, 3)
    .map((a) => a.imagemUrl?.[0])
    .filter(Boolean) as string[];

  const categoriasUnicas = useMemo(
    () =>
      [
        ...new Set(
          artesanatos
            .flatMap((a) => a.categoriaTags || [])
            .filter((t) => t?.trim())
            .map((t) => t.trim().toUpperCase())
        ),
      ].sort(),
    [artesanatos]
  );

  return (
    <section style={{ backgroundColor: "#f8f9fa" }}>
      <Container size="lg" pt={60} pb={40}>
        <Container fluid>
          <Card shadow="lg" padding="xl" radius="lg" withBorder style={{ background: "white" }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" style={{ alignItems: "center" }}>
              <div>
                <Title order={1} style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", lineHeight: 1.2 }}>
                  Bem-vindo(a) à Galeria Artesanal
                </Title>
                <Text size="lg" c="dimmed" mt="md">
                  Uma curadoria de talentos, cores e histórias.
                </Text>
                <Button size="md" mt="md" fw={700} style={{ maxWidth: "250px" }}>
                  <Link to="/listar-artesaos" style={{ color: "white", textDecoration: "none" }}>
                    Conheça os artesãos
                  </Link>
                </Button>
              </div>
              <Carousel
                withIndicators
                loop
                style={{ order: isMobile ? -1 : 0 }}
                classNames={{
                  indicator: styles["carousel-indicator"],
                  control: styles["carousel-control"],
                }}
              >
                {imagensArtesanatos.map((imagem, index) => (
                  <Carousel.Slide key={index}>
                    <Image
                      src={imagem}
                      alt={`Artesanato ${index + 1}`}
                      style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
                      radius="md"
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </SimpleGrid>
          </Card>
        </Container>

        <Title order={2} mt={{ base: 40, md: 80 }} mb={30} ta="center">
          Destaques da Semana
        </Title>

        <Container fluid>
          <ListarArtesanatosPage isHomePage showTitle={false} maxItems={3} />
        </Container>

        <Title order={2} mt={{ base: 40, md: 80 }} mb={30} ta="center">
          Categorias em Destaque
        </Title>
        <Group justify="center" gap="md">
          {categoriasUnicas.map((cat, index) => (
            <Tooltip key={index} label={`Categoria: ${cat}`} withArrow>
              <Badge variant="filled" color="blue" size="lg" style={{ cursor: "pointer" }}>
                {cat}
              </Badge>
            </Tooltip>
          ))}
        </Group>

        <Title order={2} mt={{ base: 40, md: 80 }} mb={30} ta="center">
          Comunidade Artesanal
        </Title>
        <Container>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {artesaos.map((artesao, index) => (
              <Card
                key={artesao.id || index}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ minHeight: "320px", cursor: "pointer" }}
                onClick={() => navigate(`/exibir-artesao/${artesao.id}`)}
              >
                <Group mb="md">
                  <Avatar src={artesao.fotoUrl} size="sm" />
                  <Stack gap={0}>
                    <Text fw={700} size="sm">
                      {artesao.pessoa?.nomeCompleto}
                    </Text>
                    <Text size="xs" c="dimmed">
                      @{artesao.nomeArtesao}
                    </Text>
                  </Stack>
                </Group>
                <Card.Section>
                  <Image
                    height={180}
                    src={artesao.fotoUrl}
                    alt={artesao.nomeArtesao}
                    style={{ objectFit: "cover" }}
                  />
                </Card.Section>
                <Text mt="sm" size="sm" c="dimmed" lineClamp={3}>
                  {artesao.descricaoPerfil}
                </Text>
                <Group mt="md" justify="space-between">
                  <Badge color="teal" variant="light">
                    {artesao.nichoAtuacao}
                  </Badge>
                  <Text fw={600} color="grape">
                    📍 {artesao.pessoa?.endereco?.cidade}, {artesao.pessoa?.endereco?.estado}
                  </Text>
                </Group>
                <Group mt="xs" justify="space-between">
                  <Text size="xs" c="dimmed">
                    {artesao.pessoa?.idade} anos
                  </Text>
                  <Group gap="xs">
                    {artesao.receberEncomendas && (
                      <Badge size="xs" color="green">Aceita Encomendas</Badge>
                    )}
                    {artesao.localFisico && (
                      <Badge size="xs" color="blue">Loja Física</Badge>
                    )}
                  </Group>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Container>

        <Container fluid mt="xl">
          <Flex justify="center" direction="column" align="center" gap="md" ta="center">
            <Title order={3}>Junte-se à Comunidade</Title>
            <Text size="md" c="dimmed" ta="center" style={{ maxWidth: "500px" }}>
              Faça parte de um espaço onde o talento se transforma em arte.
            </Text>
            <Button size="lg" radius="xl" color="blue">
              Criar conta
            </Button>
          </Flex>
        </Container>
      </Container>
    </section>
  );
}
