import { z } from "zod";

export const loginFormSchema = z.object({
  Email: z.string().email("Email inválido"),
  Senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export const validateLoginForm = (
  data: unknown
): { success: true; data: LoginFormSchema } | { success: false; errors: Record<string, string> } => {
  const result = loginFormSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };

  const errors: Record<string, string> = {};
  result.error.issues.forEach((err) => {
    errors[err.path.join(".")] = err.message;
  });
  return { success: false, errors };
};
