import { Link, Outlet } from "react-router-dom";
import classes from "./style.module.css";
import {
  AppShellHeader,
  UnstyledButton,
  Container,
  AppShell,
  Group,
  Text,
  Flex,
  Menu,
  Title,
  Burger,
  Drawer,
  Stack,
  Divider,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function RootLayout() {
  const isAuthenticated  = false;
  const [opened, { open, close }] = useDisclosure(false);

  const menuItems = [
    {
      title: "Início",
      link: "/",
    },
    {
      title: "Artesãos",
      items: [
        ...(isAuthenticated
          ? [{ title: "Cadastrar", link: "/cadastrar-artesao" }]
          : []),
        { title: "Ver Todos", link: "/listar-artesaos" },
      ],
    },
    {
      title: "Artesanatos",
      items: [
        ...(isAuthenticated
          ? [{ title: "Cadastrar", link: "/cadastrar-artesanato" }]
          : []),
        { title: "Ver Todos", link: "/listar-artesanatos" },
      ],
    },
    {
      title: "Conta",
      items: [
        ...(!isAuthenticated ? [{ title: "Login", link: "/login" }] : []),
        ...(isAuthenticated ? [{ title: "Logout", link: "/logout" }] : []),
      ],
    },
  ];

  return (
    <AppShell
      header={{ height: 80 }}
      padding="md"
      withBorder={false}
      styles={{
        root: {
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        },
        main: {
          backgroundColor: "#f9f9f9",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <AppShellHeader h={60} style={{ backgroundColor: "#eeeeee" }}>
        <Container size="xl" mt={5} h="60%">
          <Group justify="space-between" mt={5} align="center" h="60%">
            <Title
              order={3}
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1rem, 4vw, 1.5rem)",
              }}
            >
              Curadoria Artesanal
            </Title>

            {/* Menu Desktop */}
            <Group gap="xs" visibleFrom="md">
              <UnstyledButton
                component={Link}
                to="/"
                className={classes.control}
              >
                Início
              </UnstyledButton>

              <Menu>
                <Menu.Target>
                  <UnstyledButton className={classes.control}>
                    Artesãos
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {isAuthenticated && (
                    <Menu.Item component={Link} to="/cadastrar-artesao">
                      Cadastrar
                    </Menu.Item>
                  )}
                  <Menu.Item component={Link} to="/listar-artesaos">
                    Ver Todos
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <Menu>
                <Menu.Target>
                  <UnstyledButton className={classes.control}>
                    Artesanatos
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {isAuthenticated && (
                    <Menu.Item component={Link} to="/cadastrar-artesanato">
                      Cadastrar
                    </Menu.Item>
                  )}
                  <Menu.Item component={Link} to="/listar-artesanatos">
                    Ver Todos
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              {/* // Só mostra se showAccountMenu for true */}
              {isAuthenticated && (
                <Menu>
                  <Menu.Target>
                    <UnstyledButton className={classes.control}>
                      Conta
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {!isAuthenticated && (
                      <Menu.Item component={Link} to="/login">
                        Login
                      </Menu.Item>
                    )}
                    {isAuthenticated && (
                      <Menu.Item component={Link} to="/logout">
                        Logout
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>

            {/* Menu Mobile */}
            <Burger opened={opened} onClick={open} hiddenFrom="md" />
          </Group>
        </Container>
      </AppShellHeader>

      {/* Drawer Mobile */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Menu"
        padding="md"
        hiddenFrom="md"
        zIndex={1000000}
      >
        <Stack gap="xs">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.link ? (
                <NavLink
                  component={Link}
                  to={item.link}
                  label={item.title}
                  onClick={close}
                />
              ) : (
                <>
                  <Text fw={500} size="sm" mb="xs" mt={index > 0 ? "md" : 0}>
                    {item.title}
                  </Text>
                  {item.items?.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      component={Link}
                      to={subItem.link}
                      label={subItem.title}
                      onClick={close}
                      pl="md"
                    />
                  ))}
                </>
              )}
              {index < menuItems.length - 1 && <Divider my="sm" />}
            </div>
          ))}
        </Stack>
      </Drawer>

      <AppShell.Main
        mt={0}
        style={{
          flex: 1,
          padding: "clamp(1rem, 5vw, 5%)",
        }}
      >
        <Container
          size="xl"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Outlet />
        </Container>
      </AppShell.Main>

      <footer
        style={{
          backgroundColor: "#eeeeee",
          padding: "var(--mantine-spacing-lg)",
          marginTop: "auto",
        }}
      >
        <Container size="xl">
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", sm: "row" }}
            gap="sm"
          >
            <Text size="sm" ta={{ base: "center", sm: "left" }}>
              © {new Date().getFullYear()} Curadoria Artesanal. Todos os
              direitos reservados.
            </Text>
            <Group gap="md">
              <Text size="sm" style={{ cursor: "pointer" }}>
                Termos de Uso
              </Text>
              <Text size="sm" style={{ cursor: "pointer" }}>
                Política de Privacidade
              </Text>
            </Group>
          </Flex>
        </Container>
      </footer>
    </AppShell>
  );
}
