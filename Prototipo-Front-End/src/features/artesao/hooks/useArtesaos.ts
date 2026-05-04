import { useQuery } from "@tanstack/react-query";
import { listarArtesaos } from "../api/artesaoApi";
import type { ArtesaoFiltro } from "../api/artesaoApi";

export function useArtesaos(filtro?: ArtesaoFiltro) {
  return useQuery({
    queryKey: ["artesaos", filtro],
    queryFn: () => listarArtesaos(filtro),
  });
}
