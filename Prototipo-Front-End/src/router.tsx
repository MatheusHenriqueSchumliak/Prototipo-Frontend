import CadastrarArtesanato from "./views/artesanatos/CadastrarArtesanato";
import ListarArtesanatos from "./views/artesanatos/ListarArtesanatos";
import ExibirArtesanato from "./views/artesanatos/ExibirArtesanato";
import CadastrarUsuario from "./views/usuarios/CadastrarUsuario";
import CadastrarArtesao from "./views/artesaos/CadastrarArtesao";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ListarUsuarios from "./views/usuarios/ListarUsuarios";
import ListarArtesaos from "./views/artesaos/ListarArtesaos";
import EditarArtesao from "./views/artesaos/EditarArtesao";
import EditarUsuario from "./views/usuarios/EditarUsuario";
import ExibirArtesao from "./views/artesaos/ExibirArtesao";
import Artesanatos from "./views/artesanatos/Artesanatos";
import RootLayout from "./views/root/RootLayout";
import Teste from "./views/usuarios/Teste";
import { Home } from "./views/home/Home";
import Login from "./views/login/Login";
import Logout from "./views/login/Logout";

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
    element: <RootLayout />,
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
