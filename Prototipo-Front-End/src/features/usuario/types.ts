export interface UsuarioDto {
    Id: string;
    PessoaId: string;
    Email: string;
    SenhaHash: string;
    Role: string;
    IsAtivo: boolean;
}