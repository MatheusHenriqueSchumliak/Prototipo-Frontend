import {
  Container,
  Loader,
  SimpleGrid,
  Text,
  Alert,
  Title,
} from "@mantine/core";
import ArtesanatoCard from "../components/ArtesanatoCard";
import ArtesanatoFiltro from "../components/ArtesanatoFiltro";
import { useArtesanatos } from "../hooks/useArtesanatos";
import { useState, useMemo } from "react";
import type { ArtesanatoDTO } from "../types";

interface Filtros {
  nomeArtesanato: string;
  categoriaArtesanato: string;
  valorMinimo: number | null;
  valorMaximo: number | null;
  somenteEncomendas: boolean;
  comEstoque: boolean;
}

interface ListarArtesanatosPageProps {
  isHomePage?: boolean;
  maxItems?: number;
  showTitle?: boolean;
}

export default function ListarArtesanatosPage({
  isHomePage = false,
  maxItems,
  showTitle = true,
}: ListarArtesanatosPageProps) {
  const { data: artesanatos = [], isLoading, error } = useArtesanatos();

  const [filtros, setFiltros] = useState<Filtros>({
    nomeArtesanato: "",
    categoriaArtesanato: "",
    valorMinimo: null,
    valorMaximo: null,
    somenteEncomendas: false,
    comEstoque: false,
  });

  const dadosSelect = useMemo(
    () => ({
      artesanatos: [...new Set(artesanatos.map((a) => a.tituloArtesanato))],
      categorias: [
        ...new Set(
          artesanatos
            .flatMap((a) => (Array.isArray(a.categoriaTags) ? a.categoriaTags : [a.categoriaTags]))
            .filter(Boolean)
        ),
      ],
    }),
    [artesanatos]
  );

  const artesanatosFiltrados = useMemo(() => {
    let resultado = [...artesanatos];

    if (filtros.nomeArtesanato.trim()) {
      resultado = resultado.filter((a) =>
        a.tituloArtesanato
          .toLowerCase()
          .includes(filtros.nomeArtesanato.toLowerCase())
      );
    }
    if (filtros.categoriaArtesanato) {
      resultado = resultado.filter((a) =>
        Array.isArray(a.categoriaTags)
          ? a.categoriaTags.includes(filtros.categoriaArtesanato)
          : a.categoriaTags === filtros.categoriaArtesanato
      );
    }
    if (filtros.valorMinimo !== null && filtros.valorMinimo > 0) {
      resultado = resultado.filter((a) => a.preco >= filtros.valorMinimo!);
    }
    if (filtros.valorMaximo !== null && filtros.valorMaximo > 0) {
      resultado = resultado.filter((a) => a.preco <= filtros.valorMaximo!);
    }
    if (filtros.somenteEncomendas) {
      resultado = resultado.filter((a) => a.sobEncomenda);
    }
    if (filtros.comEstoque) {
      resultado = resultado.filter((a) => (a.quantidadeArtesanato || 0) > 0);
    }

    return maxItems ? resultado.slice(0, maxItems) : resultado;
  }, [artesanatos, filtros, maxItems]);

  const limparFiltros = () =>
    setFiltros({
      nomeArtesanato: "",
      categoriaArtesanato: "",
      valorMinimo: null,
      valorMaximo: null,
      somenteEncomendas: false,
      comEstoque: false,
    });

  const renderContent = () => {
    if (isLoading) return <Loader size="lg" />;
    if (error) return <Alert color="red">Não foi possível carregar artesanatos.</Alert>;
    if (artesanatosFiltrados.length === 0)
      return (
        <Text ta="center" c="dimmed" size="lg">
          {artesanatos.length === 0
            ? "Não há artesanatos cadastrados."
            : "Nenhum artesanato com os filtros aplicados."}
        </Text>
      );
    return (
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3 }} spacing={{ base: "xs", sm: "md" }}>
        {artesanatosFiltrados.map((a: ArtesanatoDTO) => (
          <ArtesanatoCard key={a.id} artesanato={a} />
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Container size="xl" py="xl">
      {showTitle && (
        <Title order={2} size="h2" mb="xl">
          Explore por artesanatos
        </Title>
      )}
      {!isHomePage && (
        <ArtesanatoFiltro
          filtros={filtros}
          onFiltrosChange={setFiltros}
          onFiltrar={() => {}}
          onLimparFiltros={limparFiltros}
          dadosSelect={dadosSelect}
          loading={isLoading}
        />
      )}
      {renderContent()}
    </Container>
  );
}
