import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
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
  Loader,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useArtesao } from "../hooks/useArtesao";
import { useAuth } from "../../auth/hooks/useAuth";
import ArtesanatoCard from "../../artesanato/components/ArtesanatoCard";
import { useArtesanatosPorArtesao } from "../../artesanato/hooks/useArtesanatos";

const formatCEP = (value: string) => {
  const n = value.replace(/\D/g, "");
  if (n.length <= 5) return n;
  return `${n.slice(0, 2)}.${n.slice(2, 5)}-${n.slice(5, 8)}`;
};

export default function ExibirArtesaoPage() {
  const { id } = useParams<{ id: string }>();
  const artesaoId = id?.startsWith("id=") ? id.split("=")[1] : id;
  const { data: artesao, isLoading, error } = useArtesao(artesaoId);
  const { data: artesanatos = [] } = useArtesanatosPorArtesao(artesaoId);
  const { isAuthenticated } = useAuth();
  const [mostrarFeira, setMostrarFeira] = useState(false);

  if (isLoading) return <Loader size="xl" />;
  if (error || !artesao)
    return (
      <Alert color="red">Erro ao carregar dados do artesão.</Alert>
    );

  const endereco = artesao.pessoa?.endereco;
  const contato = artesao.pessoa?.contato;
  const pessoa = artesao.pessoa;

  const numeroTelefone = contato?.telefone?.replace(/\D/g, "");
  const numeroWhatsApp = `+55${numeroTelefone}`;

  return (
    <section>
      <Container mt="lg" py="lg">
        {isAuthenticated && (
          <Link to={`/editar-artesao/${artesaoId}`}>
            <Button variant="filled" color="orange">
              Editar
            </Button>
          </Link>
        )}

        <Fieldset m="md">
          <Group align="flex-start" gap="xl" mb="xl">
            <Box mt="5%" style={{ flex: "0 0 200px" }}>
              <Image
                h={200}
                w={200}
                radius="50%"
                fit="cover"
                alt={`Foto de ${artesao.nomeArtesao}`}
                src={artesao.fotoUrl}
                style={{
                  border: "3px solid var(--mantine-color-gray-3)",
                  objectFit: "cover",
                  objectPosition: "center",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>

            <Stack flex={1} gap="md">
              <Text ta="center" size="xl" fw={700} c="dark.8">
                {artesao.nomeArtesao}
              </Text>

              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Atuação:
                </Text>
                <Text size="xl" fw={700} c="dark.8">
                  {artesao.nichoAtuacao}
                </Text>
              </Box>

              <Box>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Informações Pessoais:
                </Text>
                <Text size="xl" fw={700} c="dark.8">
                  {pessoa?.nomeCompleto} • {pessoa?.idade} anos
                </Text>
              </Box>

              <Box style={{ maxWidth: 700, margin: "0 auto" }}>
                <Text size="sm" fw={600} c="dimmed" mb="xs">
                  Sobre o Artesão:
                </Text>
                {artesao.descricaoPerfil?.split("\n").map((paragraph, index) => (
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

          <Divider label="Localização & Encomendas" mt="md" mb="md" />
          <Paper
            p="md"
            bg="gray.0"
            radius="md"
            style={{ border: "1px solid var(--mantine-color-gray-3)" }}
          >
            {artesao.localFisico ? (
              <Group align="flex-start" justify="center" gap="xl" wrap="nowrap">
                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  <Group gap="xs" mb="xs">
                    <Text component="span" fw={600} c="green.7" size="sm">
                      📍 Endereço físico
                    </Text>
                  </Group>
                  <SimpleGrid cols={1} spacing="xs">
                    <Group justify="space-between" wrap="nowrap">
                      <Text component="span" c="dimmed" size="sm" fw={500} w={80}>
                        CEP:
                      </Text>
                      <Text size="sm" fw={500}>
                        {formatCEP(endereco?.cep ?? "")}
                      </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text component="span" c="dimmed" size="sm" fw={500} w={80}>
                        Endereço:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {endereco?.rua} - Nº {endereco?.numero}
                      </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text component="span" c="dimmed" size="sm" fw={500} w={80}>
                        Bairro:
                      </Text>
                      <Text size="sm" fw={500}>
                        {endereco?.bairro}
                      </Text>
                    </Group>
                    <Group justify="space-between" wrap="nowrap">
                      <Text component="span" c="dimmed" size="sm" fw={500} w={80}>
                        Local:
                      </Text>
                      <Text size="sm" fw={500} ta="right">
                        {endereco?.cidade} - {endereco?.estado}
                      </Text>
                    </Group>
                  </SimpleGrid>
                </Stack>

                <Divider orientation="vertical" size="sm" color="gray.3" />

                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  <Text component="span" fw={600} c="green.7" size="sm">
                    📦 Serviços Oferecidos
                  </Text>
                  <Stack gap="md">
                    <Checkbox
                      readOnly
                      label="Recebe encomendas"
                      checked={artesao.receberEncomendas}
                      icon={({ indeterminate: _i, ...others }) =>
                        artesao.receberEncomendas ? <IconCheck {...others} /> : null
                      }
                    />
                    <Checkbox
                      readOnly
                      label="Envia encomendas"
                      checked={artesao.enviaEncomendas}
                      icon={({ indeterminate: _i, ...others }) =>
                        artesao.enviaEncomendas ? <IconCheck {...others} /> : null
                      }
                    />
                    <Text size="xs" c="yellow.6" fw={500}>
                      ⚠️ Combinar diretamente com o artesão.
                    </Text>
                  </Stack>
                </Stack>
              </Group>
            ) : (
              <Group align="flex-start" justify="center" gap="xl" wrap="nowrap">
                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  <Text component="span" fw={500} c="blue.7" size="sm">
                    🏠 Produção domiciliar
                  </Text>
                  <Text size="sm" mt="xs">
                    <Text component="span" c="dimmed">
                      Região de atuação:
                    </Text>{" "}
                    {endereco?.bairro} • {endereco?.cidade} • {endereco?.estado}
                  </Text>
                </Stack>
                <Divider orientation="vertical" size="sm" color="gray.3" />
                <Stack gap="sm" style={{ flex: "1 1 50%" }}>
                  <Text component="span" fw={600} c="green.7" size="sm">
                    📦 Serviços Oferecidos
                  </Text>
                  <Stack gap="md">
                    <Checkbox
                      readOnly
                      label="Recebe encomendas"
                      checked={artesao.receberEncomendas}
                      icon={({ indeterminate: _i, ...others }) =>
                        artesao.receberEncomendas ? <IconCheck {...others} /> : null
                      }
                    />
                    <Checkbox
                      readOnly
                      label="Envia encomendas"
                      checked={artesao.enviaEncomendas}
                      icon={({ indeterminate: _i, ...others }) =>
                        artesao.enviaEncomendas ? <IconCheck {...others} /> : null
                      }
                    />
                    <Text size="xs" c="yellow.6" fw={500}>
                      ⚠️ Combinar diretamente com o artesão.
                    </Text>
                  </Stack>
                </Stack>
              </Group>
            )}
          </Paper>

          {artesao.feiraMunicipal && (
            <Group gap="xs" mt="xs">
              <Text size="sm" c="green.6" fw={500}>
                🏕️ Você também pode me encontrar na feira municipal!
              </Text>
              <Button
                variant="light"
                color="green"
                size="xs"
                onClick={() => setMostrarFeira(!mostrarFeira)}
              >
                {mostrarFeira ? "Ocultar endereço da feira" : "Ver endereço da feira"}
              </Button>
            </Group>
          )}

          {artesao.feiraMunicipal && mostrarFeira && (
            <Paper p="md" bg="gray.0" mt="sm" radius="md" withBorder>
              <Stack gap="sm">
                <Text component="span" fw={600} c="green.6" size="sm">
                  🏪 Feira Municipal e Eventos
                </Text>
                <Group justify="space-between" wrap="nowrap">
                  <Text component="span" c="dimmed" size="sm" fw={500}>
                    Endereço:
                  </Text>
                  <Text size="sm" fw={500} ta="right">
                    Praça Getúlio Vargas - Centro, Pato Branco - PR
                  </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                  <Text component="span" c="dimmed" size="sm" fw={500}>
                    Dias:
                  </Text>
                  <Text size="sm" fw={500}>
                    Sábados, 08:00 às 12:00
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          <Divider label="Como entrar em contato" mt="md" mb="md" />
          <Center>
            <SimpleGrid cols={4}>
              {contato?.facebook && (
                <Button
                  leftSection={<FaFacebook />}
                  variant="filled"
                  color="blue"
                  onClick={() => window.open(contato.facebook!, "_blank")}
                >
                  Facebook
                </Button>
              )}
              {contato?.instagram && (
                <Button
                  leftSection={<FaInstagram />}
                  variant="filled"
                  color="grape"
                  onClick={() => window.open(contato.instagram!, "_blank")}
                >
                  Instagram
                </Button>
              )}
              {contato?.whatsApp && (
                <Button
                  leftSection={<FaWhatsapp />}
                  variant="filled"
                  color="green"
                  onClick={() =>
                    window.open(
                      `https://wa.me/+55${contato.whatsApp!.replace(/\D/g, "")}`,
                      "_blank"
                    )
                  }
                >
                  WhatsApp
                </Button>
              )}
              {contato?.email && (
                <Button
                  leftSection={<HiOutlineMail />}
                  variant="filled"
                  color="dark"
                  onClick={() =>
                    window.open(`mailto:${contato.email}`, "_blank")
                  }
                >
                  E-mail
                </Button>
              )}
            </SimpleGrid>
          </Center>
        </Fieldset>

        {/* Botão CTA */}
        {isAuthenticated && (
          <Center mt="md">
            <Link to="/cadastrar-artesanato">
              <Button color="blue">Cadastrar novo artesanato</Button>
            </Link>
          </Center>
        )}

        {/* Artesanatos do artesão */}
        <Divider label="Artesanatos" mt="xl" mb="md" />
        <Grid mt="md" mb="md" justify="center">
          {artesanatos.length > 0 ? (
            artesanatos.map((item, index) => (
              <Grid.Col span={4} key={`${item.id}-${index}`} style={{ display: "flex", flex: 1 }}>
                <ArtesanatoCard artesanato={item} />
              </Grid.Col>
            ))
          ) : (
            <Container>
              <Alert ta="center" c="dimmed">
                Nenhum artesanato cadastrado.
              </Alert>
            </Container>
          )}
        </Grid>
      </Container>
    </section>
  );
}
