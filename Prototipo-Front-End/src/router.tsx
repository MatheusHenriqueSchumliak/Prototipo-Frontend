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
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/Home" /> }, // Redireciona de "/" para "/Home"
      { path: "Home", element: <Home /> },

      
      { path: "ListarUsuarios", element: <ListarUsuarios /> },
      { path: "EditarUsuario", element: <EditarUsuario /> },

      { path: "ListarArtesaos", element: <ListarArtesaos /> },
      { path: "CadastrarArtesao", element: <CadastrarArtesao /> },
      { path: "EditarArtesao/:id", element: <EditarArtesao /> },
      { path: "ExibirArtesao/:id", element: <ExibirArtesao /> },

      { path: "CadastrarArtesanato", element: <CadastrarArtesanato /> },
      { path: "ListarArtesanatos", element: <ListarArtesanatos /> },
      { path: "ExibirArtesanato/:id", element: <ExibirArtesanato /> },
      { path: "Artesanatos", element: <Artesanatos /> },
      { path: "Teste", element: <Teste /> },
    ],
  },
  { path: "CadastrarUsuario", element: <CadastrarUsuario /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  
]);

export default router;
