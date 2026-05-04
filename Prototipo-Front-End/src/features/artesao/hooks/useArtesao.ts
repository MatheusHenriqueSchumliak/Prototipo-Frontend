import { useQuery } from "@tanstack/react-query";
import { buscarArtesaoPorId } from "../api/artesaoApi";

export function useArtesao(id: string | undefined) {
  return useQuery({
    queryKey: ["artesao", id],
    queryFn: () => buscarArtesaoPorId(id!),
    enabled: !!id,
  });
}
