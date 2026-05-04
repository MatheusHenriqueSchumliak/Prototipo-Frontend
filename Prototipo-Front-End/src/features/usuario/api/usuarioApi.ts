import { apiRequest } from "../../../shared/api/apiClient";
import type { UsuarioDTO } from "../types";

export const cadastrarUsuario = async (
  usuario: Pick<UsuarioDTO, "nome" | "email" | "senha">
): Promise<UsuarioDTO> => {
  return await apiRequest<UsuarioDTO>(
    "Usuario/AdicionarUsuario",
    usuario,
    "POST"
  );
};

export const listarUsuarios = async (): Promise<UsuarioDTO[]> => {
  return await apiRequest<UsuarioDTO[]>("Usuario/BuscarTodos", null, "GET");
};
