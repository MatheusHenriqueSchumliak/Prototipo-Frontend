import {
  Alert,
  Button,
  Container,
  Flex,
  Stack,
  Image,
  Badge,
  Card,
  Group,
  Text,
} from "@mantine/core";
import { Link } from "react-router-dom";

export default function Artesanatos() {
  return (
    <Container>
      <Alert
        variant="light"
        color="blue"
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Text size="xl">Explore e conheça várias obras</Text>
      </Alert>

      <Card shadow="sm" padding="md" radius="md" withBorder mt="lg">
        <Card.Section component="a" href="https://mantine.dev/">
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Flex justify="center" align="center">
          <Group
            align="center"
            justify="space-between"
            mt="md"
            mb="xs"
            gap="md"
          >
            <Text fw={500}>Seja Bem Vindo!</Text>
          </Group>
        </Flex>

        <Text size="lg" c="dimmed" style={{ textAlign: "center" }}>
          Descubra artistas e incriveis artesanatos feitos à mão, conheça todo o
          processo e muito mais.
        </Text>

        <Link to="/CadastrarUsuario">
        <Button color="blue" fullWidth mt="md" radius="md">
          Cadastrar Usuário
        </Button>
        </Link>
      </Card>

      <Stack
        h={300}
        bg="var(--mantine-color-body)"
        align="stretch"
        justify="center"
        gap="md"
      >
        <Button variant="default">1</Button>
        <Button variant="default">2</Button>
        <Button variant="default">3</Button>
      </Stack>

      <Image
        radius="md"
        h={200}
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png"
      />

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section component="a" href="https://mantine.dev/">
          <Image
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
            height={160}
            alt="Norway"
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs" gap="md">
          <Text fw={500}>Norway Fjord Adventures</Text>
          <Badge color="pink">On Sale</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
          with tours and activities on and around the fjords of Norway
        </Text>

        <Button color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    </Container>
  );
}
