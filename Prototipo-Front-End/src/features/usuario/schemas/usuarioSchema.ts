import { z } from "zod";

export const usuarioFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type UsuarioFormSchema = z.infer<typeof usuarioFormSchema>;

export const validateUsuarioForm = (
  data: unknown
): { success: true; data: UsuarioFormSchema } | { success: false; errors: Record<string, string> } => {
  const result = usuarioFormSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    errors[err.path.join(".")] = err.message;
  });
  return { success: false, errors };
};
