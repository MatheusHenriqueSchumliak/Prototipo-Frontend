import { Container, Button, Card, Flex, Group, Image, Text, SimpleGrid, Badge, Avatar, Stack, Title, Tooltip, } from "@mantine/core";
import { listarArtesanatos } from "../../services/ArtesanatoService";
import ListarArtesanatos from "../artesanatos/ListarArtesanatos";
import { ArtesanatoModel } from "../../models/ArtesanatoModel";
import { listarArtesaos } from "../../services/ArtesaoService";
import { ArtesaoModel } from "../../models/ArtesaoModel";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import styles from "./style.module.css";

export function Home() {
  const [artesaos, setArtesaos] = useState<ArtesaoModel[]>([]);
  const [artesanatos, setArtesanatos] = useState<ArtesanatoModel[]>([]);

  const [, setError] = useState<string | null>(null);
  const [, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtesanatos = async () => {

      setLoading(true);
      try {
        const resposta = await listarArtesanatos();
        setArtesanatos(resposta);
        setError(null);
      } catch (erro: any) {
        console.error("Erro ao buscar os artesanatos:", erro);
        setError("Não foi possível carregar a lista de artesanatos.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtesanatos();
  }, []);

  useEffect(() => {
    const fetchArtesaos = async () => {

      setLoading(true);
      try {
        const resposta = await listarArtesaos();
        setArtesaos(resposta);
        setError(null);
      } catch (erro: any) {
        console.error("Erro ao buscar os artesãos:", erro);
        setError("Não foi possível carregar a lista de artesãos.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtesaos();
  }, []);

  // Pega até 3 imagens (uma de cada artesanato)
  const imagensArtesanatos = artesanatos.slice(0, 3).map((artesanato) => artesanato.imagemUrl?.[0]).filter(Boolean);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const categoriasUnicas = useMemo(() => {
    return [
      ...new Set(
        artesanatos
          .flatMap((artesanato) => artesanato.categoriaTags || [])
          .filter((tag) => tag && tag.trim() !== "")
          .map((tag) => tag.trim().toUpperCase())
      ),
    ].sort();
  },
    [artesanatos]
  );

  // Função para navegar para o artesão
  const handleArtesaoClick = (artesaoId: string) => {
    navigate(`/exibir-artesao/${artesaoId}`);
  };

  return (
    <section style={{ backgroundColor: "#f8f9fa" }}>
      <Container size="lg" pt={60} pb={40}>
        {/* Hero Section */}
        <Container fluid>
          <Card shadow="lg" padding="xl" radius="lg" withBorder style={{ background: "white" }}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" style={{ alignItems: "center" }}>
              <div>
                <Title order={1} style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "#1C1C1E", lineHeight: 1.2, }}>
                  Bem-vindo(a) à Galeria Artesanal
                </Title>
                <Text size="lg" c="dimmed" mt="md" style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)" }}>
                  Uma curadoria de talentos, cores e histórias. Descubra o feito
                  à mão com alma.
                </Text>

                <Button size="md" mt="md" fw={700} style={{ maxWidth: "250px" }}>
                  <Link to="/listar-artesaos" style={{ color: "white", textDecoration: "none" }}>
                    Conheça os artesãos
                  </Link>
                </Button>
              </div>

              {/* Carrossel aqui */}
              <Carousel withIndicators loop style={{ order: isMobile ? -1 : 0 }} classNames={{ indicator: styles["carousel-indicator"], control: styles["carousel-control"], }}>
                {imagensArtesanatos.map((imagem, index) => (
                  <Carousel.Slide key={index}>
                    <Image src={imagem} alt={`Artesanato ${index + 1}`} style={{ maxHeight: "300px", objectFit: "cover", width: "100%", }} radius="md" />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </SimpleGrid>
          </Card>
        </Container>
        {/* Destaques */}
        <Title order={2} mt={{ base: 40, md: 80 }} mb={30} style={{ textAlign: "center", fontSize: "clamp(1.5rem, 4vw, 1.75rem)", }}>
          Destaques da Semana
        </Title>

        {/* Container personalizado para ListarArtesanatos */}
        <Container fluid>
          <ListarArtesanatos isHomePage={true} maxItems={3} />
        </Container>

        {/* Categorias em destaque*/}
        <Title order={2} mt={{ base: 40, md: 80 }} mb={30} style={{ textAlign: "center", fontSize: "clamp(1.5rem, 4vw, 1.75rem)", }}>
          Categorias em Destaque
        </Title>

        {/* // ✅ Para o código das tags com tooltips: */}
        <Group justify="center" gap="md">
          {categoriasUnicas.map((categoria, index) => (
            <Tooltip key={index} label={`Categoria: ${categoria}`} withArrow>
              <Badge variant="filled" color="blue" size="lg" style={{ cursor: "pointer" }}>
                {categoria}
              </Badge>
            </Tooltip>
          ))}
        </Group>

        {/* Publicações da Comunidade */}
        <Title order={2} mt={{ base: 40, md: 80 }} mb={30} style={{ textAlign: "center", fontSize: "clamp(1.5rem, 4vw, 1.75rem)", }}>
          Comunidade Artesanal
        </Title>

        {/* Seção de Artesãos */}
        <Container>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {/* ✅ CORRIGIDO: Remover [artesaos] e usar artesaos.map */}

            {artesaos.map((artesao, index) => (
              <Card key={artesao.id || index} shadow="sm" padding="lg" radius="md" withBorder
                style={{
                  minHeight: "320px",
                  cursor: "pointer", // Indica que é clicável
                  transition: "transform 0.2s ease", // Efeito suave
                }}
                // Adiciona o evento de clique no card inteiro
                onClick={() => handleArtesaoClick(artesao?.id!)}
                // Efeito hover opcional
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Group mb="md">
                  <Avatar src={artesao.fotoUrl || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"} size="sm" />
                  <Stack gap={0}>
                    <Text fw={700} size="sm">
                      {artesao.nomeCompleto} {/* ✅ CORRETO: era artesao.Nme */}
                    </Text>
                    <Text size="xs" c="dimmed">
                      @{artesao.nomeArtesao}{" "}
                      {/* ✅ CORRETO: era artesao.tempo e publi.usuario */}
                    </Text>
                  </Stack>
                </Group>

                <Card.Section>
                  <Image height={180} src={artesao.fotoUrl || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"} alt={artesao.nomeCompleto} style={{ objectFit: "cover" }} />
                </Card.Section>

                <Text mt="sm" size="sm" c="dimmed" lineClamp={3}>
                  {artesao.descricaoPerfil}
                </Text>

                <Group mt="md" justify="space-between">
                  <Badge color="teal" variant="light">
                    {artesao.nichoAtuacao} {/* ✅ CORRETO: era publi.categoria */}
                  </Badge>
                  <Text fw={600} color="grape">
                    📍 {artesao.cidade}, {artesao.estado} {/* ✅ CORRETO: era preço formatado */}
                  </Text>
                </Group>

                {/* Informações adicionais */}
                <Group mt="xs" justify="space-between">
                  <Text size="xs" c="dimmed">
                    {artesao.idade} anos
                  </Text>
                  <Group gap="xs">
                    {artesao.receberEncomendas && (
                      <Badge size="xs" color="green">
                        Aceita Encomendas
                      </Badge>
                    )}
                    {artesao.localFisico && (
                      <Badge size="xs" color="blue">
                        Loja Física
                      </Badge>
                    )}
                  </Group>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Container>

        {/* CTA Final */}
        <Container fluid mt="xl">
          <Flex justify="center" direction="column" align="center" gap="md" style={{ textAlign: "center" }}>
            <Title order={3} style={{ fontWeight: 600, fontSize: "clamp(1.25rem, 3vw, 1.5rem)", }}>
              Junte-se à Comunidade
            </Title>
            <Text size="md" c="dimmed" ta="center" style={{ maxWidth: "500px", fontSize: "clamp(0.875rem, 2vw, 1rem)", }}>
              Faça parte de um espaço onde o talento se transforma em arte, e a
              arte conecta pessoas.
            </Text>
            <Button size="lg" radius="xl" color="blue" style={{ minWidth: "200px", fontSize: "1rem", }}>
              Criar conta
            </Button>
          </Flex>
        </Container>
      </Container>
    </section>
  );
}
