import { z } from "zod";

export const artesaoFormSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome completo deve ter pelo menos 2 caracteres"),
  nomeArtesao: z.string().min(2, "Nome do perfil deve ter pelo menos 2 caracteres"),
  idade: z.number().min(18, "Deve ter ao menos 18 anos").max(120, "Idade inválida"),
  descricaoPerfil: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  telefone: z.string().optional(),
  whatsApp: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  nichoAtuacao: z.string().optional(),
  receberEncomendas: z.boolean(),
  enviaEncomendas: z.boolean(),
  localFisico: z.boolean(),
  feiraMunicipal: z.boolean(),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido. Use o formato 00000-000"),
  estado: z.string().min(2, "Estado obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  rua: z.string().min(2, "Rua obrigatória"),
  bairro: z.string().min(2, "Bairro obrigatório"),
  complemento: z.string().optional(),
  numero: z.string().optional(),
  semNumero: z.boolean(),
});

export type ArtesaoFormSchema = z.infer<typeof artesaoFormSchema>;

export const validateArtesaoForm = (
  data: unknown
): { success: true; data: ArtesaoFormSchema } | { success: false; errors: Record<string, string> } => {
  const result = artesaoFormSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return { success: false, errors };
};
