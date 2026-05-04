import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Loader } from "@mantine/core";
import AppShellLayout from "../shared/components/AppShellLayout";
import PrivateRoute from "../shared/components/PrivateRoute";

// Lazy-loaded pages
const HomePage = lazy(() =>
  import("../features/home/pages/HomePage").then((m) => ({ default: m.HomePage }))
);
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const LogoutPage = lazy(() => import("../features/auth/pages/LogoutPage"));

const ListarArtesaosPage = lazy(
  () => import("../features/artesao/pages/ListarArtesaosPage")
);
const CadastrarArtesaoPage = lazy(
  () => import("../features/artesao/pages/CadastrarArtesaoPage")
);
const EditarArtesaoPage = lazy(
  () => import("../features/artesao/pages/EditarArtesaoPage")
);
const ExibirArtesaoPage = lazy(
  () => import("../features/artesao/pages/ExibirArtesaoPage")
);

const ListarArtesanatosPage = lazy(
  () => import("../features/artesanato/pages/ListarArtesanatosPage")
);
const CadastrarArtesanatoPage = lazy(
  () => import("../features/artesanato/pages/CadastrarArtesanatoPage")
);
const ExibirArtesanatoPage = lazy(
  () => import("../features/artesanato/pages/ExibirArtesanatoPage")
);

const CadastrarUsuarioPage = lazy(
  () => import("../features/usuario/pages/CadastrarUsuarioPage")
);
const ListarUsuariosPage = lazy(
  () => import("../features/usuario/pages/ListarUsuariosPage")
);

const fallback = <Loader size="lg" style={{ margin: "auto", display: "block" }} />;

const router = createBrowserRouter([
  {
    element: <AppShellLayout />,
    children: [
      // Public routes
      {
        path: "/",
        element: (
          <Suspense fallback={fallback}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={fallback}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/logout",
        element: (
          <Suspense fallback={fallback}>
            <LogoutPage />
          </Suspense>
        ),
      },
      {
        path: "/cadastrar-usuario",
        element: (
          <Suspense fallback={fallback}>
            <CadastrarUsuarioPage />
          </Suspense>
        ),
      },
      {
        path: "/listar-artesaos",
        element: (
          <Suspense fallback={fallback}>
            <ListarArtesaosPage />
          </Suspense>
        ),
      },
      {
        path: "/exibir-artesao/:id",
        element: (
          <Suspense fallback={fallback}>
            <ExibirArtesaoPage />
          </Suspense>
        ),
      },
      {
        path: "/listar-artesanatos",
        element: (
          <Suspense fallback={fallback}>
            <ListarArtesanatosPage />
          </Suspense>
        ),
      },
      {
        path: "/exibir-artesanato/:id",
        element: (
          <Suspense fallback={fallback}>
            <ExibirArtesanatoPage />
          </Suspense>
        ),
      },

      // Protected routes (require authentication)
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/cadastrar-artesao",
            element: (
              <Suspense fallback={fallback}>
                <CadastrarArtesaoPage />
              </Suspense>
            ),
          },
          {
            path: "/editar-artesao/:id",
            element: (
              <Suspense fallback={fallback}>
                <EditarArtesaoPage />
              </Suspense>
            ),
          },
          {
            path: "/cadastrar-artesanato",
            element: (
              <Suspense fallback={fallback}>
                <CadastrarArtesanatoPage />
              </Suspense>
            ),
          },
          {
            path: "/listar-usuarios",
            element: (
              <Suspense fallback={fallback}>
                <ListarUsuariosPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
