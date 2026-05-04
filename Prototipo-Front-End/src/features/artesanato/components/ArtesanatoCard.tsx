import {
  SimpleGrid,
  Tooltip,
  Button,
  Group,
  Badge,
  Image,
  Card,
  Text,
  Box,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { Link } from "react-router-dom";
import type { ArtesanatoDTO } from "../types";

interface ArtesanatoCardProps {
  artesanato: ArtesanatoDTO;
  isCompact?: boolean;
}

const formatarTempoProdução = (horas: number): string => {
  if (horas < 24) return `${horas} ${horas === 1 ? "hora" : "horas"}`;
  const dias = Math.floor(horas / 24);
  const horasRestantes = horas % 24;
  if (horasRestantes === 0)
    return `${dias} ${dias === 1 ? "dia" : "dias"}`;
  return `${dias} ${dias === 1 ? "dia" : "dias"} e ${horasRestantes} ${horasRestantes === 1 ? "hora" : "horas"}`;
};

export default function ArtesanatoCard({
  artesanato,
  isCompact = false,
}: ArtesanatoCardProps) {
  return (
    <Card
      shadow={isCompact ? "md" : "xl"}
      padding={isCompact ? "sm" : "md"}
      radius="md"
      withBorder
      style={{
        minHeight: isCompact ? "250px" : "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Card.Section>
        <Carousel
          withIndicators={!isCompact}
          slideSize="100%"
          slideGap="md"
          loop
          align="start"
        >
          {artesanato.imagemUrl?.map((url, index) => (
            <Carousel.Slide key={index}>
              <Image
                p={isCompact ? "xs" : "sm"}
                src={url}
                alt={`Imagem ${index + 1} de ${artesanato.tituloArtesanato}`}
                style={{
                  width: "100%",
                  height: isCompact ? "150px" : "300px",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "8px",
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Card.Section>

      <Tooltip label={artesanato.tituloArtesanato}>
        <Text
          fw={500}
          ta="center"
          size={isCompact ? "sm" : "md"}
          truncate="end"
        >
          {artesanato.tituloArtesanato}
        </Text>
      </Tooltip>

      {artesanato.categoriaTags?.length > 0 && (
        <SimpleGrid
          cols={
            isCompact
              ? Math.min(2, artesanato.categoriaTags.length)
              : artesanato.categoriaTags.length
          }
        >
          {(isCompact
            ? artesanato.categoriaTags.slice(0, 2)
            : artesanato.categoriaTags
          ).map((tag, index) => (
            <Tooltip key={index} label={`Categoria: ${tag}`} withArrow>
              <Badge
                variant="default"
                mt="xs"
                size={isCompact ? "xs" : "sm"}
                style={{ cursor: "pointer" }}
              >
                {tag}
              </Badge>
            </Tooltip>
          ))}
          {isCompact && artesanato.categoriaTags.length > 2 && (
            <Badge variant="default" mt="xs" size="xs" color="gray">
              +{artesanato.categoriaTags.length - 2}
            </Badge>
          )}
        </SimpleGrid>
      )}

      <Group justify="space-between" align="center" mt="md">
        <Group gap="xs">
          {artesanato.sobEncomenda && (
            <Badge variant="outline" color="orange" size={isCompact ? "xs" : "sm"}>
              Somente sob encomenda
            </Badge>
          )}
          {!artesanato.sobEncomenda && artesanato.quantidadeArtesanato !== undefined && (
            <Badge color="blue" variant="outline" size={isCompact ? "xs" : "sm"}>
              {artesanato.quantidadeArtesanato} unidades disponíveis
            </Badge>
          )}
        </Group>
        {!isCompact && (
          <Badge variant="transparent" color="lime" size="sm">
            Aceita Cartão
          </Badge>
        )}
      </Group>

      <Group justify="space-between" align="center">
        <Box>
          <Text component="span" size="sm" c="dimmed">
            Valor:{" "}
          </Text>
          <Text component="span" fw={500} c="green">
            R$ {artesanato.preco},00
          </Text>
        </Box>
        <Text size="sm" c="dimmed">
          Tempo: {formatarTempoProdução(Number(artesanato.tempoCriacaoHr))}
        </Text>
      </Group>

      <Link to={`/exibir-artesanato/${artesanato.id}`}>
        <Button
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          size={isCompact ? "xs" : "sm"}
        >
          Acessar
        </Button>
      </Link>
    </Card>
  );
}
