import {
  Card,
  Stack,
  Text,
  Group,
  TextInput,
  Select,
  Button,
  NumberInput,
  Checkbox,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface Filtros {
  nomeArtesanato: string;
  categoriaArtesanato: string;
  valorMinimo: number | null;
  valorMaximo: number | null;
  somenteEncomendas: boolean;
  comEstoque: boolean;
}

interface DadosSelect {
  artesanatos: string[];
  categorias: string[];
}

interface ArtesanatoFiltroProps {
  filtros: Filtros;
  onFiltrosChange: (filtros: Filtros) => void;
  onFiltrar: () => void;
  onLimparFiltros: () => void;
  dadosSelect?: DadosSelect;
  loading?: boolean;
}

const ArtesanatoFiltro = ({
  filtros,
  onFiltrosChange,
  onFiltrar,
  onLimparFiltros,
  dadosSelect = { artesanatos: [], categorias: [] },
  loading = false,
}: ArtesanatoFiltroProps) => {
  const handleInputChange = (campo: string, valor: string | number | boolean) => {
    onFiltrosChange({ ...filtros, [campo]: valor });
  };

  return (
    <Card shadow="lg" padding="xl" radius="lg" withBorder style={{ marginBottom: "20px" }}>
      <Stack mb="md" gap="md">
        <Text>Filtros</Text>
        <Group align="flex-start" gap="md">
          <TextInput
            label="Nome do Artesanato"
            placeholder="Filtrar por nome"
            leftSection={<IconSearch size={16} />}
            value={filtros.nomeArtesanato || ""}
            onChange={(e) => handleInputChange("nomeArtesanato", e.currentTarget.value)}
            w={350}
          />
          <Select
            label="Categoria"
            placeholder="Filtrar por categoria"
            data={dadosSelect.categorias}
            value={filtros.categoriaArtesanato || ""}
            onChange={(v) => handleInputChange("categoriaArtesanato", v || "")}
            w={300}
            searchable
            clearable
          />
          <Group>
            <NumberInput
              label="Preço mínimo"
              placeholder="R$ mín"
              value={filtros.valorMinimo ?? undefined}
              onChange={(v) => handleInputChange("valorMinimo", v)}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix="R$ "
              min={0}
              w={150}
            />
            <NumberInput
              label="Preço máximo"
              placeholder="R$ máx"
              value={filtros.valorMaximo ?? undefined}
              onChange={(v) => handleInputChange("valorMaximo", v)}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix="R$ "
              w={150}
            />
          </Group>
          <Button mt={25} onClick={onLimparFiltros} loading={loading} bg="yellow">
            Limpar
          </Button>
          <Button mt={25} onClick={onFiltrar} loading={loading} bg="green">
            Filtrar
          </Button>
        </Group>
        <Group>
          <Checkbox
            label="Somente Encomendas"
            checked={filtros.somenteEncomendas || false}
            onChange={(e) => handleInputChange("somenteEncomendas", e.currentTarget.checked)}
          />
          <Checkbox
            label="Com Estoque Disponível"
            checked={filtros.comEstoque || false}
            onChange={(e) => handleInputChange("comEstoque", e.currentTarget.checked)}
          />
        </Group>
      </Stack>
    </Card>
  );
};

export default ArtesanatoFiltro;
