import { listarArtesanatos } from "../../services/ArtesanatoService";
import {
  Container,
  Loader,
  SimpleGrid,
  Text,
  Alert,
  Title,
  Box,
} from "@mantine/core";
import { ArtesanatoModel } from "../../models/ArtesanatoModel";
import CardArtesanato from "./CardArtesanato";
import { useEffect, useState } from "react";
import ArtesanatoFiltro from "../../components/ArtesanatoFiltro";

interface Filtros {
  nomeArtesao: string;
  nomeArtesanato: string;
  categoriaArtesanato: string;
  valorMinimo: number | null;
  valorMaximo: number | null;
  somenteEncomendas: boolean;
  comEstoque: boolean;
}

interface ListarArtesanatosProps {
  isHomePage?: boolean;
  maxItems?: number;
  showTitle?: boolean;
}

export default function ListarArtesanatos({
  isHomePage = false,
  maxItems,
  showTitle = true,
}: ListarArtesanatosProps) {
  const [artesanatos, setArtesanatos] = useState<ArtesanatoModel[]>([]);
  const [artesanatosFiltrados, setArtesanatosFiltrados] = useState<
    ArtesanatoModel[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para os filtros
  const [filtros, setFiltros] = useState<Filtros>({
    nomeArtesao: "",
    nomeArtesanato: "",
    categoriaArtesanato: "",
    valorMinimo: null,
    valorMaximo: null,
    somenteEncomendas: false,
    comEstoque: false,
  });

  // Dados para os selects (você pode buscar de uma API ou extrair dos artesanatos)
  const [dadosSelect, setDadosSelect] = useState({
    artesanatos: [] as string[],
    categorias: [] as string[],
  });

  // Buscar artesanatos da API
  useEffect(() => {
    const fetchArtesanatos = async () => {
      setLoading(true);
      try {
        const resposta = await listarArtesanatos();

        const artesanatosTratados = resposta.map((item: ArtesanatoModel) => ({
          ...item,
          Imagem: Array.isArray(item.imagem) ? item.imagem : [],
        }));

        setArtesanatos(artesanatosTratados);
        setArtesanatosFiltrados(artesanatosTratados); // Inicialmente todos os artesanatos

        // Extrair dados únicos para os selects
        const nomesArtesanatos = [
          ...new Set(artesanatosTratados.map((item) => item.tituloArtesanato)),
        ];
        const categorias = [
          ...new Set(
            artesanatosTratados
              .flatMap((item) =>
                Array.isArray(item.categoriaTags)
                  ? item.categoriaTags
                  : [item.categoriaTags]
              )
              .filter(Boolean)
          ),
        ];

        setDadosSelect({
          artesanatos: nomesArtesanatos,
          categorias: categorias,
        });

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

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      nomeArtesao: "",
      nomeArtesanato: "",
      categoriaArtesanato: "",
      valorMinimo: 0,
      valorMaximo: 0,
      somenteEncomendas: false,
      comEstoque: false,
    });
  };

  // Função para aplicar os filtros
  const aplicarFiltros = () => {
    let resultado = [...artesanatos];

    // Filtro por nome do artesão (assumindo que existe um campo NomeArtesao ou similar)
    if (filtros.nomeArtesao.trim()) {
      resultado = resultado.filter((item) =>
        (item.tituloArtesanato || "")
          .toLowerCase()
          .includes(filtros.nomeArtesao.toLowerCase())
      );
    }

    // Filtro por nome do artesanato
    if (filtros.nomeArtesanato.trim()) {
      resultado = resultado.filter((item) =>
        item.tituloArtesanato.toLowerCase().includes(
          filtros.nomeArtesanato.toLowerCase()
        )
      );
    }

    // Filtro por categoria
    if (filtros.categoriaArtesanato && filtros.categoriaArtesanato !== "") {
      resultado = resultado.filter((item) =>
        Array.isArray(item.categoriaTags)
          ? item.categoriaTags.includes(filtros.categoriaArtesanato)
          : item.categoriaTags === filtros.categoriaArtesanato
      );
    }

    // Filtro por valor mínimo
    if (filtros.valorMinimo !== null && filtros.valorMinimo > 0) {
      resultado = resultado.filter(
        (item) => item.preco >= filtros.valorMinimo!
      );
    }

    // Filtro por valor máximo
    if (filtros.valorMaximo !== null && filtros.valorMaximo > 0) {
      resultado = resultado.filter(
        (item) => item.preco <= filtros.valorMaximo!
      );
    }

    // Filtro somente encomendas (assumindo que existe um campo TipoVenda ou similar)
    if (filtros.somenteEncomendas) {
      resultado = resultado.filter((item) => item.sobEncomenda == true);
    }

    // Filtro com estoque (assumindo que existe um campo Estoque)
    if (filtros.comEstoque) {
      resultado = resultado.filter(
        (item) => (item.quantidadeArtesanato || 0) > 0
      );
    }

    // Aplicar limite de itens se especificado
    const resultadoFinal = maxItems ? resultado.slice(0, maxItems) : resultado;

    setArtesanatosFiltrados(resultadoFinal);
  };

  // Aplicar filtros sempre que os filtros mudarem
  useEffect(() => {
    if (artesanatos.length > 0) {
      aplicarFiltros();
    }
  }, [filtros, artesanatos, maxItems]);

  // Configuração para máximo 3 colunas
  const getColumnsOption = () => {
    if (isHomePage) {
      return { base: 1, xs: 2, sm: 2, md: 3 }; // Máximo 3 colunas
    }
    return { base: 1, xs: 2, sm: 2, md: 3 }; // Máximo 3 colunas para todas as páginas
  };

  const getColumns = getColumnsOption;

  // Spacing responsivo - menor no mobile quando há 2 colunas
  const getSpacing = () => {
    return { base: "xs", xs: "sm", sm: "md", md: "lg" };
  };

  // Conteúdo do grid - agora usa artesanatosFiltrados
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <Loader size="lg" />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert color="red" title="Erro">
          {error}
        </Alert>
      );
    }

    if (artesanatosFiltrados.length === 0) {
      return (
        <Text ta="center" c="dimmed" size="lg">
          {artesanatos.length === 0
            ? "Não há artesanatos cadastrados no momento."
            : "Nenhum artesanato encontrado com os filtros aplicados."}
        </Text>
      );
    }

    return (
      <SimpleGrid cols={getColumns()} spacing={getSpacing()}>
        {artesanatosFiltrados.map((artesanato) => (
          <CardArtesanato key={artesanato.id} artesanato={artesanato} />
        ))}
      </SimpleGrid>
    );
  };

  // Se for homepage, não usa Container próprio
  if (isHomePage) {
    return (
     <Container size="xl" py="xl">
      {/* {showTitle && (
        <Title order={2} size="h2" mb="xl">
          Explore por artesanatos
        </Title>
      )} */}
      {/* Componente de Filtro */}
      {/* <ArtesanatoFiltro
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onFiltrar={aplicarFiltros}
        onLimparFiltros={limparFiltros}
        dadosSelect={dadosSelect}
        loading={loading}
      />  */}
      {renderContent()}
    </Container>
    );
  }

  // Para página dedicada, mantém Container
  return (
    <Container size="xl" py="xl">
      {showTitle && (
        <Title order={2} size="h2" mb="xl">
          Explore por artesanatos
        </Title>
      )}
      {/* Componente de Filtro */}
      <ArtesanatoFiltro
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onFiltrar={aplicarFiltros}
        onLimparFiltros={limparFiltros}
        dadosSelect={dadosSelect}
        loading={loading}
      /> 
      {renderContent()}
    </Container>
  );
}
