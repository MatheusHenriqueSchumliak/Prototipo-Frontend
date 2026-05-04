/** DTO de usuário — camelCase alinhado ao backend */
export interface UsuarioDTO {
  id: string;
  pessoaId: string;
  nome: string;
  email: string;
  senha: string;
  role: string;
}
