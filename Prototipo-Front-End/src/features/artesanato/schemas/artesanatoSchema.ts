import { z } from "zod";

export const artesanatoFormSchema = z.object({
  artesaoId: z.string().uuid("Selecione um artesão válido"),
  tituloArtesanato: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres"),
  descricaoArtesanato: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  sobEncomenda: z.boolean(),
  aceitaEncomenda: z.boolean(),
  categoriaTags: z
    .array(z.string())
    .min(1, "Adicione pelo menos 1 categoria")
    .max(5, "Máximo de 5 categorias"),
  preco: z.number().min(0, "Preço não pode ser negativo"),
  quantidadeArtesanato: z.number().min(0),
  materiaisUtilizados: z.string().min(3, "Informe os materiais utilizados"),
  tempoCriacaoHr: z.string(),
});

export type ArtesanatoFormSchema = z.infer<typeof artesanatoFormSchema>;

export const validateArtesanatoForm = (
  data: unknown
): { success: true; data: ArtesanatoFormSchema } | { success: false; errors: Record<string, string> } => {
  const result = artesanatoFormSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    errors[err.path.join(".")] = err.message;
  });
  return { success: false, errors };
};
