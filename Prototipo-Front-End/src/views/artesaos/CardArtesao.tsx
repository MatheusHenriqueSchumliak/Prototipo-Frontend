import { Card, Image, Text, Badge, Button, SimpleGrid, Center, } from "@mantine/core";
import { TbHome, TbNotes, TbCubeSend, TbCategory } from "react-icons/tb";
import { ArtesaoModel } from "../../models/ArtesaoModel";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface CardArtesaoProps {
  artesao: ArtesaoModel;
}

export default function CardArtesao({ artesao }: CardArtesaoProps) {
  useEffect(() => {
    if (!artesao.id) {
      console.warn("Artesão ou ID inválido:", artesao.id);
      return;
    }
  }, [artesao]);

  return (
    <Card shadow="md" padding="lg" radius="md" withBorder className="transition hover:shadow-xl"    >
      {/* Imagem */}
      <Card.Section>
        <Image id="imagemPerfil" src={artesao.fotoUrl} height={250} p="sm" alt={`Foto de ${artesao.nomeArtesao}`} fit="cover" radius="md" />
      </Card.Section>

      {/* Nome */}
      <Center mt="md">
        <Text fw={700} size="lg">
          {artesao.nomeArtesao}
        </Text>
      </Center>

      {/* Badges principais */}
      <SimpleGrid cols={2} spacing="md" mt="md">
        <Badge variant="light" color={artesao.receberEncomendas ? "green" : "red"} size="lg" radius="md" leftSection={<TbNotes size={16} />}>
          {artesao.receberEncomendas ? "Aceita encomendas" : "Não aceita encomendas"}
        </Badge>

        <Badge variant="light" color={artesao.enviaEncomendas ? "orange" : "red"} size="lg" radius="md" leftSection={<TbCubeSend size={16} />}>
          {artesao.enviaEncomendas ? "Envia encomendas" : "Somente retirada"}
        </Badge>
      </SimpleGrid>

      {/* Descrição */}
      <Text size="sm" c="dimmed" mt="md" lineClamp={2} ta="center">
        {artesao.descricaoPerfil}
      </Text>

      {/* Localização */}
      <Center mt="md" mb="md">
        <Badge variant="default" size="lg" radius="md" leftSection={<TbHome size={16} />}        >
          {artesao.cidade} - {artesao.estado}
        </Badge>
      </Center>
      <Badge variant="default" size="lg" radius="md" leftSection={<TbCategory size={16} />}      >
        {artesao.nichoAtuacao}
      </Badge>
      {/* Botão */}
      <Link to={acessaArtesaoComID()}>
        <Button color="blue" fullWidth mt="lg" radius="xl">
          Acessar
        </Button>
      </Link>
    </Card>
  );
  function acessaArtesaoComID() {
    return `/exibir-artesao/${artesao.id}`;
  }
}
