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
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import ArtesaoCard from "../components/ArtesaoCard";
import { useArtesaos } from "../hooks/useArtesaos";
import type { ArtesaoFiltro } from "../api/artesaoApi";
import type { ArtesaoDTO } from "../types";

export default function ListarArtesaosPage() {
  const [filtroAtivo, setFiltroAtivo] = useState<ArtesaoFiltro>({});
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroAtuacao, setFiltroAtuacao] = useState("");
  const [receberEncomendas, setReceberEncomendas] = useState<boolean | null>(null);
  const [enviaEncomendas, setEnviaEncomendas] = useState<boolean | null>(null);

  const { data: artesaos = [], isLoading, error } = useArtesaos(filtroAtivo);

  const aplicarFiltros = () => {
    setFiltroAtivo({
      nome: filtroNome.trim() || undefined,
      nichoAtuacao: filtroAtuacao.trim() || undefined,
      receberEncomendas: receberEncomendas ?? undefined,
      enviaEncomendas: enviaEncomendas ?? undefined,
    });
  };

  const obterNichosUnicos = () => {
    const nichosUnicos = Array.from(
      new Set(
        artesaos
          .map((a: ArtesaoDTO) => a.nichoAtuacao)
          .filter((n): n is string => !!n)
      )
    );
    return nichosUnicos.map((n) => ({ value: n, label: n }));
  };

  return (
    <section>
      <Container>
        <Text size="xl" py="xl">
          Lista de Artesãos
        </Text>

        <Card shadow="lg" padding="xl" radius="lg" withBorder style={{ marginBottom: "20px" }}>
          <Stack mb="md" gap="md">
            <Text>Filtros</Text>
            <Group align="flex-start" gap="md">
              <TextInput
                label="Nome do Artesão"
                placeholder="Filtrar por nome"
                leftSection={<IconSearch size={16} />}
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.currentTarget.value)}
                w={300}
              />
              <Select
                label="Área de Atuação"
                placeholder="Filtrar por área"
                data={obterNichosUnicos()}
                value={filtroAtuacao}
                onChange={(v) => setFiltroAtuacao(v || "")}
                w={300}
                searchable
                clearable
              />
              <Button mt={25} onClick={aplicarFiltros}>
                Filtrar
              </Button>
            </Group>
            <Group>
              <Checkbox
                label="Recebe Encomendas"
                checked={receberEncomendas === true}
                onChange={(e) =>
                  setReceberEncomendas(e.currentTarget.checked ? true : null)
                }
              />
              <Checkbox
                label="Envia Encomendas"
                checked={enviaEncomendas === true}
                onChange={(e) =>
                  setEnviaEncomendas(e.currentTarget.checked ? true : null)
                }
              />
            </Group>
          </Stack>
        </Card>

        {isLoading ? (
          <Loader size="xl" />
        ) : error ? (
          <Text c="red">Não foi possível carregar a lista de artesãos.</Text>
        ) : artesaos.length === 0 ? (
          <Text>Nenhum artesão encontrado.</Text>
        ) : (
          <SimpleGrid cols={2}>
            {artesaos.map((artesao: ArtesaoDTO) => (
              <ArtesaoCard key={artesao.id} artesao={artesao} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </section>
  );
}
