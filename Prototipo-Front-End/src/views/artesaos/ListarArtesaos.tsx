import {
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { ArtesaoModel } from "./../../models/ArtesaoModel";
import { useEffect, useState } from "react";
import CardArtesao from "./CardArtesao";
import { listarArtesaos } from "../../services/ArtesaoService";
import { IconSearch } from "@tabler/icons-react";

export default function ListarArtesaos() {
  const [artesaos, setArtesaos] = useState<ArtesaoModel[]>([]);
  const [filtroNome, setFiltroNome] = useState<string>("");
  const [receberEncomendas, setReceberEncomendas] = useState<boolean | null>(
    null
  );
  const [enviaEncomendas, setEnviaEncomendas] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtroAtuacao, setFiltroAtuacao] = useState<string>("");

  const fetchArtesaos = async () => {
    setLoading(true);
    try {
      const resposta = await listarArtesaos({
        nome: filtroNome.trim() !== "" ? filtroNome : undefined,
        nichoAtuacao: filtroAtuacao.trim() !== "" ? filtroAtuacao : undefined,
        receberEncomendas,
        enviaEncomendas,
      });
      setArtesaos(resposta);
      setError(null);
    } catch (erro: any) {
      console.error("Erro ao buscar os artesãos:", erro);
      setError("Não foi possível carregar a lista de artesãos.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega inicialmente todos
  useEffect(() => {
    fetchArtesaos();
  }, []);

  // Adicione esta função antes do return
  const obterNichosUnicos = () => {
    const nichosUnicos = Array.from(
      new Set(
        artesaos
          .map((artesao) => artesao.nichoAtuacao)
          .filter((nicho): nicho is string => nicho !== undefined && nicho !== null && nicho !== "")
      )
    );

    return nichosUnicos.map((nicho) => ({
      value: nicho,
      label: nicho,
    }));
  };

  return (
    <section>
      <Container>
        <Text size="xl" py="xl">
          Lista de Artesãos
        </Text>

        {/* Campo de filtro */}
        <Card
          shadow="lg"
          padding="xl"
          radius="lg"
          withBorder
          style={{ background: "white", padding: "20px", marginBottom: "20px" }}
        >
          <Stack mb="md" gap="md">
            <Text>Filtros</Text>

            {/* Primeira linha - Filtros por nome e atuação */}
            <Group align="flex-start" gap="md">
              <TextInput
                label="Nome do Artesão"
                placeholder="Filtrar por nome do artesão"
                leftSection={<IconSearch size={16} />}
                value={filtroNome}
                onChange={(event) => setFiltroNome(event.currentTarget.value)}
                w={300}
              />
              <Select
                label="Área de Atuação"
                placeholder="Filtrar por área de atuação"
                data={obterNichosUnicos()}
                value={filtroAtuacao}
                onChange={(value) => setFiltroAtuacao(value || "")}
                w={300}
                searchable
                clearable
              />
              <Button mt={25} onClick={fetchArtesaos}>
                Filtrar
              </Button>
            </Group>

            {/* Segunda linha - Checkboxes e botão */}
            <Group>
              <Checkbox
                label="Recebe Encomendas"
                checked={receberEncomendas === true}
                onChange={(event) =>
                  setReceberEncomendas(
                    event.currentTarget.checked ? true : null
                  )
                }
              />
              <Checkbox
                label="Envia Encomendas"
                checked={enviaEncomendas === true}
                onChange={(event) =>
                  setEnviaEncomendas(event.currentTarget.checked ? true : null)
                }
              />
            </Group>

          </Stack>
        </Card>

        {loading ? (
          <Loader size="xl" />
        ) : error ? (
          <Text c="red">{error}</Text>
        ) : artesaos.length === 0 ? (
          <Text>Nenhum artesão encontrado com esse nome.</Text>
        ) : (
          <SimpleGrid cols={2}>
            {artesaos.map((artesao, index) => (
              <CardArtesao key={artesao.id || index} artesao={artesao} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </section>
  );
}
