import CadastrarArtesanato from "../features/artesanato/views/CadastrarArtesanato";
import ListarArtesanatos from "../features/artesanato/views/ListarArtesanatos";
import ExibirArtesanato from "../features/artesanato/views/ExibirArtesanato";
import Artesanatos from "../features/artesanato/views/Artesanatos";
import CadastrarUsuario from "../views/usuarios/CadastrarUsuario";
import CadastrarArtesao from "../views/artesaos/CadastrarArtesao";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShellLayout from "../shared/components/AppShellLayout";
import ListarUsuarios from "../views/usuarios/ListarUsuarios";
import ListarArtesaos from "../views/artesaos/ListarArtesaos";
import EditarArtesao from "../views/artesaos/EditarArtesao";
import EditarUsuario from "../views/usuarios/EditarUsuario";
import ExibirArtesao from "../views/artesaos/ExibirArtesao";
import Logout from "../features/auth/views/login/Logout";
import Login from "../features/auth/views/login/Login";
import Teste from "../views/usuarios/Teste";
import { Home } from "../views/home/Home";

const router = createBrowserRouter([
  // ✅ Rotas públicas (sem autenticação)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastrar-usuario",
    element: <CadastrarUsuario />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },

  // 🔒 Rotas protegidas (com autenticação)
  {
    path: "/",
    element: <AppShellLayout />,
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: "home", element: <Home /> },

      { path: "listar-usuarios", element: <ListarUsuarios /> },
      { path: "editar-usuario", element: <EditarUsuario /> },

      { path: "listar-artesaos", element: <ListarArtesaos /> },
      { path: "cadastrar-artesao", element: <CadastrarArtesao /> },
      { path: "editar-artesao/:id", element: <EditarArtesao /> },
      { path: "exibir-artesao/:id", element: <ExibirArtesao /> },

      { path: "cadastrar-artesanato", element: <CadastrarArtesanato /> },
      { path: "listar-artesanatos", element: <ListarArtesanatos /> },
      { path: "exibir-artesanato/:id", element: <ExibirArtesanato /> },
      { path: "artesanatos", element: <Artesanatos /> },
      { path: "teste", element: <Teste /> },
    ],
  },
]);


export default router;
