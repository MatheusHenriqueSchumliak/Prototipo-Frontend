// import UsuarioForm from "../../components/UsuarioForm";

// export default function CadastrarUsuario() {
//   return (
//     <UsuarioForm />
//   );
// }
// views/usuarios/CadastrarUsuario.tsx
import UsuarioForm from "../../components/UsuarioForm";
import React, { useEffect } from "react";

/**
 * Página de cadastro de usuário
 *
 * Esta página é responsável por:
 * - Renderizar o formulário de cadastro de usuário
 * - Definir metadados da página (título, descrição)
 * - Manter a separação entre página e componente
 */
const CadastrarUsuario: React.FC = () => {
  
  // Define o título da página
  useEffect(() => {
    document.title = "Cadastrar Usuário | Sua Aplicação";
  }, []);

  return <UsuarioForm />;
};

export default CadastrarUsuario;