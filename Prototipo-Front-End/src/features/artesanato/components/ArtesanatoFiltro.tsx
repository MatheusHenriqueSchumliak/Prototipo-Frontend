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
  nomeArtesao: string;
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
  dadosSelect = {
    artesanatos: [],
    categorias: [],
  },
  loading = false,
}: ArtesanatoFiltroProps) => {
  const handleInputChange = (
    campo: string,
    valor: string | number | boolean
  ) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
    });
  };

  return (
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
            label="Nome do Artesanato"
            placeholder="Filtrar por nome do Artesanato"
            leftSection={<IconSearch size={16} />}
            value={filtros.nomeArtesanato || ""}
            onChange={(event) =>
              handleInputChange("nomeArtesanato", event.currentTarget.value)
            }
            w={350}
          />

          <Select
            label="Categoria de Artesanato"
            placeholder="Filtrar por categoria de artesanato"
            data={dadosSelect.categorias}
            value={filtros.categoriaArtesanato || ""}
            onChange={(value) =>
              handleInputChange("categoriaArtesanato", value || "")
            }
            w={300}
            searchable
            clearable
          />

          <Group>
            <NumberInput
              label="Faixa de Preço"
              placeholder="Valor mínimo"
              value={filtros.valorMinimo ?? undefined}
              onChange={(value) => handleInputChange("valorMinimo", value)}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              min={0}
              w={150}
              styles={{
                input: {
                  textAlign: "center",
                },
              }}
            />
            <NumberInput
              label="Faixa de Preço"
              placeholder="Valor máximo"
              value={filtros.valorMaximo ?? undefined}
              onChange={(value) => handleInputChange("valorMaximo", value)}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              w={150}
              min={filtros.valorMinimo || 0}
              styles={{
                input: {
                  textAlign: "center",
                },
              }}
            />
          </Group>
          <Button mt={25} onClick={onLimparFiltros} loading={loading} bg={"yellow"}>
            Limpar
          </Button>
          <Button mt={25} onClick={onFiltrar} loading={loading} bg={"green"}>
            Filtrar
          </Button>
        </Group>

        {/* Segunda linha - Valores mínimo e máximo */}
        <Stack gap="md">
          <Group>
            <Checkbox
              label="Somente Encomendas"
              checked={filtros.somenteEncomendas || false}
              onChange={(event) =>
                handleInputChange(
                  "somenteEncomendas",
                  event.currentTarget.checked
                )
              }
            />
            <Checkbox
              label="Com Estoque Disponível"
              checked={filtros.comEstoque || false}
              onChange={(event) =>
                handleInputChange("comEstoque", event.currentTarget.checked)
              }
            />
          </Group>
        </Stack>

      </Stack>
    </Card>
  );
};

export default ArtesanatoFiltro;
