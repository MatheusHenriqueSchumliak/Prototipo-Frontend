import { useQuery } from "@tanstack/react-query";
import {
  listarArtesanatos,
  buscarArtesanatosPorArtesao,
} from "../api/artesanatoApi";

export function useArtesanatos() {
  return useQuery({
    queryKey: ["artesanatos"],
    queryFn: listarArtesanatos,
  });
}

export function useArtesanatosPorArtesao(artesaoId: string | undefined) {
  return useQuery({
    queryKey: ["artesanatos", "artesao", artesaoId],
    queryFn: () => buscarArtesanatosPorArtesao(artesaoId!),
    enabled: !!artesaoId,
  });
}
