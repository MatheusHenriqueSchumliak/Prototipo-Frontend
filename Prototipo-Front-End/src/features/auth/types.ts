export interface LoginRequestDTO {
  Email: string;
  Senha: string;
}

export interface LoginResponseDTO {
  Token: string;
  Nome: string;
  Email: string;
  Role: string;
}
