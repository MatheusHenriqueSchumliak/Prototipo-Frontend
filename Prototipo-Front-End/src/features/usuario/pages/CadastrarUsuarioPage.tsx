import React, { useEffect } from "react";
import UsuarioForm from "../components/UsuarioForm";

const CadastrarUsuarioPage: React.FC = () => {
  useEffect(() => {
    document.title = "Cadastrar Usuário | Galeria Artesanal";
  }, []);

  return <UsuarioForm />;
};

export default CadastrarUsuarioPage;
