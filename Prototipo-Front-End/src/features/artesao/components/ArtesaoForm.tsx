import {
  Container,
  Center,
  Fieldset,
  SimpleGrid,
  Avatar,
  FileInput,
  FileInputProps,
  InputBase,
  Textarea,
  Checkbox,
  TextInput,
  Button,
  Pill,
} from "@mantine/core";
import { mascaraTelefone } from "../../../shared/utils/masks";
import type { ArtesaoFormViewModel } from "../types";

interface ArtesaoFormProps {
  form: ArtesaoFormViewModel;
  onFieldChange: <K extends keyof ArtesaoFormViewModel>(
    field: K,
    value: ArtesaoFormViewModel[K]
  ) => void;
  onCepBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
  if (value === null) return null;
  if (Array.isArray(value)) {
    return (
      <Pill.Group>
        {value.map((file, index) => (
          <Pill key={index}>{file.name}</Pill>
        ))}
      </Pill.Group>
    );
  }
  return <Pill>{value.name}</Pill>;
};

export default function ArtesaoForm({
  form,
  onFieldChange,
  onCepBlur,
  onSubmit,
  isSubmitting = false,
}: ArtesaoFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      onFieldChange(id as keyof ArtesaoFormViewModel, checked as never);
    } else if (id === "telefone" || id === "whatsApp") {
      onFieldChange(id as keyof ArtesaoFormViewModel, mascaraTelefone(value) as never);
    } else {
      onFieldChange(id as keyof ArtesaoFormViewModel, value as never);
    }
  };

  return (
    <section>
      <Container>
        <Center>
          <form onSubmit={onSubmit}>
            <Fieldset legend="Informações do Artesão">
              <Center>
                <SimpleGrid cols={1} spacing="sm">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {form.imagem && (
                      <Avatar
                        variant="default"
                        radius="xl"
                        size={100}
                        alt="Imagem do artesão"
                        src={
                          form.imagem instanceof File
                            ? URL.createObjectURL(form.imagem)
                            : form.fotoUrl
                        }
                        style={{
                          objectFit: "cover",
                          width: "100px",
                          height: "100px",
                        }}
                      />
                    )}
                  </div>
                  <FileInput
                    id="imagem"
                    label="Foto de perfil"
                    placeholder="Selecione sua foto"
                    multiple={false}
                    accept="image/png,image/jpeg"
                    valueComponent={ValueComponent}
                    onChange={(file) => onFieldChange("imagem", file)}
                  />
                </SimpleGrid>
              </Center>

              <SimpleGrid cols={2}>
                <InputBase
                  id="nomeCompleto"
                  label="Nome Completo:"
                  placeholder="Nome Completo"
                  type="text"
                  required
                  w={350}
                  radius="md"
                  value={form.nomeCompleto}
                  onChange={(e) => onFieldChange("nomeCompleto", e.target.value)}
                />
                <InputBase
                  id="idade"
                  label="Idade:"
                  placeholder="21"
                  type="number"
                  maxLength={2}
                  w={300}
                  radius="md"
                  value={form.idade || ""}
                  onChange={handleInputChange}
                />
                <InputBase
                  id="nomeArtesao"
                  label="Nome do perfil:"
                  placeholder="Nome do perfil"
                  type="text"
                  required
                  w={350}
                  radius="md"
                  value={form.nomeArtesao}
                  onChange={(e) => onFieldChange("nomeArtesao", e.target.value)}
                />
                <InputBase
                  id="telefone"
                  label="Telefone:"
                  placeholder="(99) 9 9999-9999"
                  maxLength={15}
                  w={300}
                  radius="md"
                  value={form.telefone}
                  onChange={handleInputChange}
                />
                <InputBase
                  id="whatsApp"
                  label="WhatsApp:"
                  placeholder="(99) 9 9999-9999"
                  maxLength={15}
                  w={300}
                  radius="md"
                  value={form.whatsApp}
                  onChange={handleInputChange}
                />
                <InputBase
                  id="email"
                  label="E-mail:"
                  placeholder="email@exemplo.com"
                  maxLength={50}
                  w={300}
                  radius="md"
                  value={form.email}
                  onChange={handleInputChange}
                />
                <InputBase
                  id="instagram"
                  label="Instagram:"
                  placeholder="https://www.instagram.com/usuario"
                  maxLength={50}
                  w={300}
                  radius="md"
                  value={form.instagram}
                  onChange={handleInputChange}
                />
                <InputBase
                  id="facebook"
                  label="Facebook:"
                  placeholder="https://www.facebook.com/usuario"
                  maxLength={50}
                  w={300}
                  radius="md"
                  value={form.facebook}
                  onChange={handleInputChange}
                />
              </SimpleGrid>

              <InputBase
                id="nichoAtuacao"
                label="Nicho de Atuação:"
                placeholder="Nicho de atuação"
                maxLength={50}
                w={300}
                radius="md"
                value={form.nichoAtuacao}
                onChange={handleInputChange}
              />

              <Textarea
                id="descricaoPerfil"
                label="Descrição:"
                placeholder="Descreva sobre a sua marca."
                required
                rows={5}
                radius="md"
                resize="vertical"
                value={form.descricaoPerfil}
                onChange={(e) => onFieldChange("descricaoPerfil", e.target.value)}
              />

              <Fieldset legend="Informações sobre encomendas">
                <SimpleGrid cols={2} spacing="sm">
                  <Checkbox
                    id="receberEncomendas"
                    label="Aceito receber encomendas."
                    p="md"
                    checked={form.receberEncomendas}
                    onChange={(e) =>
                      onFieldChange("receberEncomendas", e.target.checked)
                    }
                  />
                  <Checkbox
                    id="enviaEncomendas"
                    label="Aceita enviar encomendas."
                    p="md"
                    checked={form.enviaEncomendas}
                    onChange={(e) =>
                      onFieldChange("enviaEncomendas", e.target.checked)
                    }
                  />
                </SimpleGrid>
              </Fieldset>

              <Fieldset legend="Informações de endereço">
                <SimpleGrid cols={2} mt={5} spacing="">
                  <Checkbox
                    id="localFisico"
                    label="Possui local físico"
                    checked={form.localFisico}
                    onChange={(e) =>
                      onFieldChange("localFisico", e.target.checked)
                    }
                  />
                  <Checkbox
                    id="feiraMunicipal"
                    label="Feira Municipal"
                    checked={form.feiraMunicipal}
                    onChange={(e) =>
                      onFieldChange("feiraMunicipal", e.target.checked)
                    }
                  />
                </SimpleGrid>
                <SimpleGrid cols={3} mt={5} spacing="">
                  <TextInput
                    id="cep"
                    label="CEP:"
                    placeholder="00000-000"
                    required
                    w={110}
                    radius="md"
                    value={form.cep}
                    onChange={(e) => onFieldChange("cep", e.target.value)}
                    onBlur={onCepBlur}
                  />
                  <TextInput
                    id="estado"
                    label="Estado:"
                    placeholder="Selecione"
                    required
                    ml="-101px"
                    w={200}
                    radius="md"
                    value={form.estado}
                    onChange={(e) => onFieldChange("estado", e.target.value)}
                  />
                  <TextInput
                    id="cidade"
                    label="Cidade:"
                    placeholder="Selecione"
                    required
                    ml="-130px"
                    w={150}
                    radius="md"
                    value={form.cidade}
                    onChange={(e) => onFieldChange("cidade", e.target.value)}
                  />
                </SimpleGrid>
                <SimpleGrid cols={5} mt={5} spacing="xs">
                  <TextInput
                    id="rua"
                    label="Rua:"
                    placeholder="Rua lorem ipsum"
                    w={150}
                    radius="md"
                    required
                    value={form.rua}
                    onChange={(e) => onFieldChange("rua", e.target.value)}
                  />
                  <TextInput
                    id="bairro"
                    label="Bairro:"
                    placeholder="Bairro exemplo x"
                    required
                    w={150}
                    radius="md"
                    value={form.bairro}
                    onChange={(e) => onFieldChange("bairro", e.target.value)}
                  />
                  <TextInput
                    id="complemento"
                    label="Complemento:"
                    placeholder="Apto x"
                    w={150}
                    radius="md"
                    value={form.complemento}
                    onChange={(e) =>
                      onFieldChange("complemento", e.target.value)
                    }
                  />
                  <TextInput
                    id="numero"
                    label="N°:"
                    placeholder="0000"
                    w={70}
                    radius="md"
                    value={form.numero}
                    onChange={(e) => onFieldChange("numero", e.target.value)}
                  />
                  <Checkbox
                    id="semNumero"
                    label="Sem N°"
                    p="xl"
                    ml="-100px"
                    checked={form.semNumero}
                    onChange={(e) =>
                      onFieldChange("semNumero", e.target.checked)
                    }
                  />
                </SimpleGrid>
              </Fieldset>

              <Button
                m="md"
                type="submit"
                radius="md"
                color="green"
                loading={isSubmitting}
              >
                Salvar
              </Button>
            </Fieldset>
          </form>
        </Center>
      </Container>
    </section>
  );
}
