import { apiRequest } from "../../../shared/api/apiClient";
import type { LoginRequestDTO, LoginResponseDTO } from "../types";

export const loginUsuario = async (
  dados: LoginRequestDTO
): Promise<LoginResponseDTO> => {
  const response = await apiRequest<LoginResponseDTO>(
    "Auth/Login",
    dados,
    "POST"
  );

  if (!response.Token) {
    throw new Error("Token não retornado pela API.");
  }

  return response;
};
