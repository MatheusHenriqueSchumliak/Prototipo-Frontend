import { Card, Image, Text, Badge, Button, SimpleGrid, Center } from "@mantine/core";
import { TbHome, TbNotes, TbCubeSend, TbCategory } from "react-icons/tb";
import { Link } from "react-router-dom";
import type { ArtesaoDTO } from "../types";

interface ArtesaoCardProps {
  artesao: ArtesaoDTO;
}

export default function ArtesaoCard({ artesao }: ArtesaoCardProps) {
  const cidade = artesao.pessoa?.endereco?.cidade;
  const estado = artesao.pessoa?.endereco?.estado;

  return (
    <Card
      shadow="md"
      padding="lg"
      radius="md"
      withBorder
      className="transition hover:shadow-xl"
    >
      <Card.Section>
        <Image
          src={artesao.fotoUrl}
          height={250}
          p="sm"
          alt={`Foto de ${artesao.nomeArtesao}`}
          fit="cover"
          radius="md"
        />
      </Card.Section>

      <Center mt="md">
        <Text fw={700} size="lg">
          {artesao.nomeArtesao}
        </Text>
      </Center>

      <SimpleGrid cols={2} spacing="md" mt="md">
        <Badge
          variant="light"
          color={artesao.receberEncomendas ? "green" : "red"}
          size="lg"
          radius="md"
          leftSection={<TbNotes size={16} />}
        >
          {artesao.receberEncomendas ? "Aceita encomendas" : "Não aceita encomendas"}
        </Badge>

        <Badge
          variant="light"
          color={artesao.enviaEncomendas ? "orange" : "red"}
          size="lg"
          radius="md"
          leftSection={<TbCubeSend size={16} />}
        >
          {artesao.enviaEncomendas ? "Envia encomendas" : "Somente retirada"}
        </Badge>
      </SimpleGrid>

      <Text size="sm" c="dimmed" mt="md" lineClamp={2} ta="center">
        {artesao.descricaoPerfil}
      </Text>

      <Center mt="md" mb="md">
        <Badge variant="default" size="lg" radius="md" leftSection={<TbHome size={16} />}>
          {cidade} - {estado}
        </Badge>
      </Center>

      <Badge variant="default" size="lg" radius="md" leftSection={<TbCategory size={16} />}>
        {artesao.nichoAtuacao}
      </Badge>

      <Link to={`/exibir-artesao/${artesao.id}`}>
        <Button color="blue" fullWidth mt="lg" radius="xl">
          Acessar
        </Button>
      </Link>
    </Card>
  );
}
