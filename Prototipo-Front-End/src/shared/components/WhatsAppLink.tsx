import { Button } from "@mantine/core";

interface WhatsAppLinkProps {
  telefone: string;
  mensagem: string;
}

export default function WhatsAppLink({ telefone, mensagem }: WhatsAppLinkProps) {
  const mensagemCodificada = encodeURIComponent(mensagem);
  const linkWhatsApp = `https://wa.me/${telefone}?text=${mensagemCodificada}`;

  return (
    <Button component="a" href={linkWhatsApp} target="_blank" color="green" radius="md">
      Fale pelo WhatsApp
    </Button>
  );
}
