import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { ArtesaoModel } from "../../models/ArtesaoModel";
import { buscarArtesaoPorId } from "../../services/ArtesaoService";
import { Link, useParams } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { useState, useEffect } from "react";
import {
  Container,
  Text,
  SimpleGrid,
  Group,
  Divider,
  Center,
  Button,
  Alert,
  Image,
  Checkbox,
  Fieldset,
  Grid,
  Box,
  Paper,
  Stack,
} from "@mantine/core";
import { ArtesanatoModel } from "../../models/ArtesanatoModel";
import { useAuth } from "../../features/auth/context/AuthContext";
import CardArtesanato from "../../features/artesanato/components/CardArtesanato";
import { BuscarArtesanatoPorArtesaoId } from "../../services/ArtesanatoService";
import { IconCheck } from "@tabler/icons-react";

export default function ExibirArtesao() {
  const [, setErro] = useState<string | null>(null);
  const { id } = useParams<{ id?: string }>();
  const [artesao, setArtesao] = useState<ArtesaoModel | null>(null);
  const artesaoId = id && id.startsWith("id=") ? id.split("=")[1] : id;
  const [artesanatos, setArtesanatos] = useState<ArtesanatoModel[]>([]);
  const { isAuthenticated } = useAuth();
  const [mostrarFeira, setMostrarFeira] = useState(false);

  const formatCEP = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara 00000-000
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}-${numbers.slice(
      5,
      8
    )}`;
  };

  function acessaArtesaoComID() {
    return `/CadastrarArtesanato`;
  }

  useEffect(() => {
    if (!artesaoId) return;

    const carregarArtesao = async () => {
      try {
        const artesaoEncontrado = await buscarArtesaoPorId(artesaoId);
        setArtesao(artesaoEncontrado);

        // console.log(
        //   `Artesão Encontrado: ${JSON.stringify(artesaoEncontrado, null, 2)}`
        // );
      } catch (err) {
        console.log(err);
        setErro("Erro ao carregar dados do artesão ou sua imagem.");
      }
    };

    const carregarArtesanatos = async () => {
      try {
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
  }, [id]);

  // Renderização condicional enquanto os dados são carregados
  if (!artesao) {
    return (
      <section>
        <Container>
          <Center>
            <Text>Carregando informações do artesão...</Text>
          </Center>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container mt="lg" py="lg">
        {isAuthenticated && (
          <Link to={`/EditarArtesao/${artesaoId}`}>
            <Button variant="filled" color="orange">
              Editar
            </Button>
          </Link>
        )}

        {/* Layout com imagem à esquerda e informações à direita */}
        <Fieldset m="md">
          <Group align="flex-start" gap="xl" mb="xl" >
            {/* Imagem do perfil - lado esquerdo */}
            <Box mt="5%" style={{ flex: "0 0 200px" }}>
              <Image
                h={200}
                w={200}
                radius="50%" // Deixa a imagem completamente redonda
                fit="cover"
                id="imagemPerfil"
                alt={`Foto de ${artesao.nomeArtesao}`}
                src={
                  artesao.imagem instanceof File
                    ? URL.createObjectURL(artesao.imagem)
                    : artesao.fotoUrl
                }
                style={{
                  border: "3px solid var(--mantine-color-gray-3)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "1rem",
                  objectFit: "cover", // Garante que a imagem preencha o espaço
                  objectPosition: "center", // Centraliza a imagem
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>

            {/* Informações do artesão - lado direito */}
            <Stack flex={1} gap="md">
              {/* Nome do artesão */}
              <Text ta={"center"} size="xl" fw={700} c="dark.8">
                {artesao.nomeArtesao}
              </Text>

              {/*Area de Atuação */}
              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Atuação:
                </Text>
                <Text size="xl" fw={700} c="dark.8">
                  {artesao.nichoAtuacao}
                </Text>
              </Box>

              {/*Informações Pessoais */}
              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Informaçãoes Pessoais:
                </Text>
                <Text size="xl" fw={700} c="dark.8">
                  {artesao.nomeCompleto} • {artesao.idade} anos
                </Text>
              </Box>

              {/* Descrição do artesão */}
              <Box style={{ maxWidth: 700, margin: "0 auto" }}>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Sobre o Artesão:
                </Text>
                {artesao?.descricaoPerfil!.split("\n").map((paragraph, index) => (
                  <Text
                    key={index}
                    ta="justify"
                    size="md"
                    lh={1.6}
                    mb="md"
                    c="dark.8"
                    style={{ textIndent: "1.5em" }}
                  >
                    {paragraph}
                  </Text>
                ))}
              </Box>
            </Stack>
          </Group>

          {/* Informações sobre encomendas */}
          <Divider label="Localização & Encomendas" mt="md" mb="md" />
          <Paper
            p="md"
            bg="gray.0"
            radius="md"
            style={{
              border: "1px solid var(--mantine-color-gray-3)",
            }}
          >
            {/* Sempre mostra o endereço principal primeiro */}
            {artesao.localFisico ? (
              <Group align="flex-start" justify="center" gap="xl" wrap="nowrap">
                {/* Lado Esquerdo - Informações de Localização */}
                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  {/* Cabeçalho da Seção */}
                  <Group gap="xs" mb="xs">
                    <Text component="span" fw={600} c="green.7" size="sm">
                      📍 Endereço físico
                    </Text>
                  </Group>

                  {/* Grid de Informações */}
                  <SimpleGrid cols={1} spacing="xs">
                    <Group justify="space-between" wrap="nowrap">
                      <Text
                        component="span"
                        c="dimmed"
                        size="sm"
                        fw={500}
                        w={80}
                      >
                        CEP:
                      </Text>
                      <Text size="sm" fw={500}>
                        {formatCEP(artesao?.cep!)}
                      </Text>
                    </Group>

                    <Group justify="space-between" wrap="nowrap">
                      <Text
                        component="span"
                        c="dimmed"
                        size="sm"
                        fw={500}
                        w={80}
                      >
                        Endereço:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {artesao.rua} - Nº {artesao.numero}
                      </Text>
                    </Group>

                    <Group justify="space-between" wrap="nowrap">
                      <Text
                        component="span"
                        c="dimmed"
                        size="sm"
                        fw={500}
                        w={80}
                      >
                        Bairro:
                      </Text>
                      <Text size="sm" fw={500}>
                        {artesao.bairro}
                      </Text>
                    </Group>

                    <Group justify="space-between" wrap="nowrap">
                      <Text
                        component="span"
                        c="dimmed"
                        size="sm"
                        fw={500}
                        w={80}
                      >
                        Local:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {artesao.cidade} - {artesao.estado}
                      </Text>
                    </Group>
                  </SimpleGrid>
                </Stack>

                {/* Divisor Visual */}
                <Divider orientation="vertical" size="sm" color="gray.3" />

                {/* Lado Direito - Serviços Oferecidos */}
                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  {/* Cabeçalho da Seção */}
                  <Group gap="xs" mb="xs">
                    <Text component="span" fw={600} c="green.7" size="sm">
                      📦 Serviços Oferecidos
                    </Text>
                  </Group>

                  {/* Container dos Checkboxes */}

                  <Stack gap="md">
                    <Checkbox
                      readOnly
                      label="Recebe encomendas"
                      checked={artesao.receberEncomendas}
                      styles={{
                        label: { fontSize: "14px", fontWeight: 500 },
                        input: { cursor: "default" },
                      }}
                      icon={({ indeterminate, ...others }) =>
                        artesao.receberEncomendas ? (
                          <IconCheck {...others} />
                        ) : null
                      }
                    />

                    <Checkbox
                      readOnly
                      label="Envia encomendas fora da cidade ou estado"
                      checked={artesao.enviaEncomendas}
                      styles={{
                        label: { fontSize: "14px", fontWeight: 500 },
                        input: { cursor: "default" },
                      }}
                      icon={({ indeterminate, ...others }) =>
                        artesao.enviaEncomendas ? (
                          <IconCheck {...others} />
                        ) : null
                      }
                    />

                    <Group gap="xs" mt="xs">
                      <Text size="xs" c="yellow.6" fw={500}>
                        ⚠️ - Combinar DIRETAMENTE com o artesão.
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Group>
            ) : (
              // Endereço resumido para local não físico (produção domiciliar)
              <Group align="flex-start" justify="center" gap="xl" wrap="nowrap">
                {/* Lado Esquerdo - Produção Domiciliar */}
                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  <Text component="span" fw={500} c="blue.7" size="sm">
                    🏠 Produção domiciliar
                  </Text>
                  <Text size="sm" mt="xs">
                    <Text component="span" c="dimmed">
                      Região de atuação:
                    </Text>{" "}
                    {artesao.bairro} • {artesao.cidade} • {artesao.estado}
                  </Text>
                </Stack>

                {/* Divisor */}
                <Divider orientation="vertical" size="sm" color="gray.3" />

                {/* Lado Direito - Serviços Oferecidos */}
                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  <Text component="span" fw={600} c="green.7" size="sm">
                    📦 Serviços Oferecidos
                  </Text>

                  <Stack gap="md">
                    <Checkbox
                      readOnly
                      label="Recebe encomendas"
                      checked={artesao.receberEncomendas}
                      styles={{
                        label: { fontSize: "14px", fontWeight: 500 },
                        input: { cursor: "default" },
                      }}
                      icon={({ indeterminate, ...others }) =>
                        artesao.receberEncomendas ? (
                          <IconCheck {...others} />
                        ) : null
                      }
                    />

                    <Checkbox
                      readOnly
                      label="Envia encomendas fora da cidade ou estado"
                      checked={artesao.enviaEncomendas}
                      styles={{
                        label: { fontSize: "14px", fontWeight: 500 },
                        input: { cursor: "default" },
                      }}
                      icon={({ indeterminate, ...others }) =>
                        artesao.enviaEncomendas ? (
                          <IconCheck {...others} />
                        ) : null
                      }
                    />

                    <Group gap="xs" mt="xs">
                      <Text size="xs" c="yellow.6" fw={500}>
                        ⚠️ - Combinar DIRETAMENTE com o artesão.
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Group>
            )}
          </Paper>

          {/* Botão para mostrar informações da feira */}
          {artesao.feiraMunicipal && (
            <Group gap="xs" mt="xs">
              <Text size="sm" c="green.6" fw={500}>
                🏕️ - Você também pode me encontrar na feira municipal!
              </Text>
              <Button
                variant="light"
                color="green"
                size="xs"
                onClick={() => setMostrarFeira(!mostrarFeira)}
              >
                {mostrarFeira
                  ? "Ocultar endereço da feira"
                  : "Ver endereço da feira"}
              </Button>
            </Group>
          )}

          {/* Informações da feira (expandível) */}
          {artesao.feiraMunicipal && mostrarFeira && (
            <Paper p="md" bg="gray.0" mt="sm" radius="md" withBorder>
              <Stack gap="sm">
                {/* Cabeçalho da Feira */}
                <Group gap="xs" mb="xs">
                  <Text component="span" fw={600} c="green.6" size="sm">
                    🏪 Feira Municipal e Eventos
                  </Text>
                </Group>
                {/* Informações da Feira */}
                <Group justify="space-between" wrap="nowrap">
                  <Text component="span" c="dimmed" size="sm" fw={500}>
                    Endereço da Feira:
                  </Text>
                  <Text size="sm" fw={500} ta="right">
                    Praça Getúlio Vargas - Centro, Pato Branco - PR
                  </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                  <Text component="span" c="dimmed" size="sm" fw={500}>
                    CEP:
                  </Text>
                  <Text size="sm" fw={500}>
                    85501-030
                  </Text>
                </Group>
                {/* Informações adicionais da feira se existirem */}
                <Group justify="space-between" wrap="nowrap">
                  <Text component="span" c="dimmed" size="sm" fw={500}>
                    Dias de funcionamento:
                  </Text>
                  <Text size="sm" fw={500}>
                    Sábados
                  </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                  <Text component="span" c="dimmed" size="sm" fw={500}>
                    Horário:
                  </Text>
                  <Text size="sm" fw={500}>
                    08:00 às 12:00
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          {/* Como entrar em contato */}
          <Divider label="Como entrar em contato" mt="md" mb="md" />
          <Center>
            <SimpleGrid cols={4}>
              {artesao.facebook && (
                <Button
                  leftSection={<FaFacebook />}
                  variant="filled"
                  color="blue"
                  onClick={() =>
                    //window.open(`https://wa.me/${artesao.WhatsApp}`, "_blank")
                    window.open(
                      `https://facebook.com/${artesao.facebook}`,
                      "_blank"
                    )
                  }
                >
                  Facebook
                </Button>
              )}
              {artesao.instagram && (
                <Button
                  leftSection={<FaInstagram />}
                  variant="filled"
                  color="#e619db"
                  onClick={() =>
                    //window.open(`https://wa.me/${artesao.WhatsApp}`, "_blank")
                    window.open(
                      `https://instagram.com/${artesao.instagram}`,
                      "_blank"
                    )
                  }
                >
                  Instagram
                </Button>
              )}
              {artesao.whatsApp && (
                <Button
                  leftSection={<FaWhatsapp />}
                  variant="filled"
                  color="teal"
                  onClick={() =>
                    window.open(
                      `https://wa.me/+55${artesao.whatsApp}`,
                      "_blank"
                    )
                  }
                >
                  WhatsApp
                </Button>
              )}
              {artesao.email && (
                <Button
                  leftSection={<HiOutlineMail />}
                  variant="filled"
                  color="gray"
                  onClick={
                    () => handleEmailClick()
                    //window.open(`https://wa.me/${artesao.WhatsApp}`, "_blank")
                    // window.open(`mailto:${artesao.WhatsApp}`, "_blank")
                  }
                >
                  E-mail
                </Button>
              )}
            </SimpleGrid>
          </Center>
        </Fieldset>

        <Divider label="Obras do Artesão" mt="md" mb="md" />

        <Fieldset m="md">
          {isAuthenticated && (
            <Link
              to={acessaArtesaoComID()}
              onClick={() => {
                if (artesaoId) localStorage.setItem("artesaoId", artesaoId);
              }}
            >
              <Button variant="filled" color="green">
                Cadastrar
              </Button>
            </Link>
          )}

          <Grid mt="md" mb="md" justify="center">
            {Array.isArray(artesanatos) && artesanatos.length > 0 ? (
              artesanatos
                .filter((artesanato) => artesanato && artesanato.id) // Filtra itens válidos
                .map((artesanato, index) => (
                  <Grid.Col
                    span={4}
                    key={`artesanato-${artesanato.id}-${index}`}
                  >
                    <CardArtesanato artesanato={artesanato} />
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
        </Fieldset>
      </Container>
    </section>
  );

  function handleEmailClick() {
    if (!artesao) return;
    window.location.href = `mailto:${artesao.email}?subject=Contato via Plataforma&body=Olá, gostaria de saber mais sobre seus artesanatos.`;
  }
}
