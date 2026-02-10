import { ArtesaoFormProps, ArtesaoModel } from "../models/ArtesaoModel";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { atualizaArtesao, cadastrarArtesao } from "../services/ArtesaoService";

import {
  Container,
  Center,
  Fieldset,
  SimpleGrid,
  Avatar,
  FileInput,
  InputBase,
  Textarea,
  Checkbox,
  TextInput,
  Button,
  FileInputProps,
  Pill,
} from "@mantine/core";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ArtesaoForm: React.FC<ArtesaoFormProps> = ({ artesao = {} as ArtesaoModel }) => {
  const [, setFotoUrl] = useState<string | null>(null);
  const usuarioId = localStorage.getItem("usuarioId");
  const [, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  // const isEditing = artesao.Id;
  const MySwal = withReactContent(Swal);

  useParams<{ id: string }>();

  const [artesaoState, setArtesaoState] = useState<ArtesaoModel>({
    ...artesao,
    id: String(artesao?.id || "00000000-0000-0000-0000-000000000001"),
    nomeArtesao: artesao?.nomeArtesao || "",
    nomeCompleto: artesao?.nomeCompleto || "",
    idade: artesao?.idade || 0,
    telefone: artesao?.telefone || "",
    whatsApp: artesao?.whatsApp || "",
    email: artesao?.email || "",
    instagram: artesao?.instagram || "",
    facebook: artesao?.facebook || "",
    nichoAtuacao: artesao?.nichoAtuacao || "",
    descricaoPerfil: artesao?.descricaoPerfil || "",
    usuarioId: usuarioId || "00cb252e-0310-41fe-8014-3549e7fa2b3f",
    receberEncomendas: artesao?.receberEncomendas || false,
    localFisico: artesao?.localFisico || false,
    feiraMunicipal: artesao?.feiraMunicipal || false,
    enviaEncomendas: artesao?.enviaEncomendas || false,
    imagem: artesao?.imagem || null,
    fotoUrl: artesao?.fotoUrl || "",
    cep: artesao?.cep || "",
    estado: artesao?.estado || "",
    cidade: artesao?.cidade || "",
    rua: artesao?.rua || "",
    bairro: artesao?.bairro || "",
    complemento: artesao?.complemento || "",
    numero: artesao?.numero || "",
    semNumero: artesao?.semNumero || false,
    dataCadastro: artesao?.dataCadastro || new Date(),
  });

  const handleFileChange = (file: File | null) => {
    setArtesaoState((prevState) => ({ ...prevState, imagem: file }));
  };

  const handleChange = (
    value: string | boolean | string[] | number | File | null,
    id: keyof ArtesaoModel
  ) => {
    setArtesaoState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Função para atualizar o estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked, files } = e.target;

    // Verifica se o campo é do tipo 'file' (imagem)
    if (type === "file") {
      const file = files ? files[0] : null; // Pega o primeiro arquivo, caso haja
      // Se um arquivo foi selecionado, atualiza o estado com o arquivo
      if (file) {
        setArtesaoState((prevState) => ({
          ...prevState,

          [id]: file, // Armazena o arquivo como um array com 1 item (imagem)
        }));
      }
    } else {
      // Aplica a máscara conforme o campo
      const formataTelefones =
        id === "telefone" || id === "whatsApp" ? mascaraTelefone(value) : value;

      // Lida com checkbox para valores booleanos
      if (type === "checkbox") {
        setArtesaoState((prevState) => ({
          ...prevState,
          [id]: checked,
        }));
      } else {
        setArtesaoState((prevState) => ({
          ...prevState,
          [id]: formataTelefones,
        }));
      }
    }
  };

  // Função que busca as informações do CEP
  const buscarCep = async () => {
    // Remove traços e espaços do CEP para garantir o formato correto
    const cep = artesaoState.cep?.replace(/\D/g, "");

    if (!cep || cep.length !== 8) {
      alert("Digite um CEP válido com 8 números.");
      return;
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${artesaoState.cep}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setArtesaoState((prevState) => ({
          ...prevState,
          Estado: data.uf,
          Cidade: data.localidade,
          Rua: data.logradouro,
          Bairro: data.bairro,
        }));
      } else {
        alert("CEP não encontrado!");
        setArtesaoState((prevState) => ({
          ...prevState,
          estado: "",
          cidade: "",
          rua: "",
          bairro: "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setErrorMessage(String(error));
      alert("Erro ao buscar o CEP. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    if (artesaoState.imagem instanceof File) {
      const url = URL.createObjectURL(artesaoState.imagem);
      setFotoUrl(url); // Atualiza apenas a URL da imagem
      return () => URL.revokeObjectURL(url); // Revoga a URL quando não for mais necessário
    }
  }, [artesaoState.imagem]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!artesaoState.imagem) {
        MySwal.fire({
          title: "Atenção!",
          html: "Por favor, adicione pelo menos uma imagem do artesão.",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }

      // ✅ Verificar se é atualização ou cadastro
      const isUpdate =
        artesaoState.id &&
        artesaoState.id !== "00000000-0000-0000-0000-000000000000" &&
        artesaoState.id !== "00000000-0000-0000-0000-000000000001";

      let artesaoResultado: ArtesaoModel;

      if (isUpdate) {
        // ✅ ATUALIZAÇÃO - Passa o objeto diretamente
        console.log("🔄 Atualizando artesão com ID:", artesaoState.id);

        artesaoResultado = await atualizaArtesao(artesaoState.id!, artesaoState as unknown as FormData);

        MySwal.fire({
          title: "Sucesso!",
          html: "Artesão atualizado com sucesso!",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate(`/ExibirArtesao/${artesaoState.id}`);
        });
      } else {
        // ✅ CADASTRO - Remove Id e passa o objeto
        console.log("➕ Cadastrando novo artesão");

        const { id, ...artesaoSemId } = artesaoState;

        artesaoResultado = await cadastrarArtesao(artesaoSemId as ArtesaoModel);

        MySwal.fire({
          title: "Sucesso!",
          html: "Artesão cadastrado com sucesso!",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          navigate(`/ExibirArtesao/${artesaoResultado.id}`);
        });
      }
    } catch (error: any) {
      // ... resto do código de erro
    }
  };


  const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
    if (value === null) {
      return null;
    }

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

  return (
    <section>
      <Container>
        <Center>
          <form onSubmit={handleSubmit}>
            <Fieldset legend="Informações do Artesão">
              {/* <Center>
                <SimpleGrid cols={2}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {artesao.imagem && (
                      <Avatar
                        variant="default"
                        radius="xl"
                        size={100}
                        src={URL.createObjectURL(artesao.imagem)}
                        alt="Imagem do artesão"
                        style={{
                          objectFit: "cover", // Faz a imagem se ajustar sem distorção
                          width: "100px", // Tamanho fixo
                          height: "100px", // Tamanho fixo
                          position: "relative", // Previne o deslocamento do Avatar
                        }}
                      />
                    )}
                  </div>
                  <FileInput
                    label="Foto de perfil"
                    placeholder="Selecione sua foto"
                    id="imagem"
                    onChange={(file) => handleFilesChange(file as File | null)}
                    valueComponent={ValueComponent}
                    multiple={false}
                    accept="image/png,image/jpeg"
                  />
                </SimpleGrid>
              </Center> */}

              <Center>
                <SimpleGrid cols={1} spacing="sm">
                  {" "}
                  {/* Layout em coluna para uma boa disposição */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {artesaoState.imagem && (
                      <Avatar
                        variant="default"
                        radius="xl"
                        size={100} // Tamanho fixo, mas você pode ajustar conforme a necessidade
                        //src={URL.createObjectURL(artesao.imagem)}
                        src={
                          artesaoState.imagem instanceof File
                            ? URL.createObjectURL(artesaoState.imagem)
                            : Array.isArray(artesaoState.fotoUrl)
                              ? artesaoState.fotoUrl // Usa o primeiro valor se for um array
                              : artesaoState.fotoUrl
                        }
                        alt="Imagem do artesão"
                        style={{
                          objectFit: "cover", // Faz a imagem se ajustar sem distorção
                          width: "100px", // Largura fixa
                          height: "100px", // Altura fixa
                          position: "relative", // Previne o deslocamento do Avatar
                          maxWidth: "100%", // Ajuste para que o avatar ocupe até 100% do espaço disponível
                          maxHeight: "100%", // Previne esticar a imagem se for muito grande
                        }}
                      />
                    )}
                  </div>
                  <FileInput
                    label="Foto de perfil"
                    placeholder="Selecione sua foto"
                    id="imagem"
                    onChange={(file) => handleFileChange(file as File | null)}
                    valueComponent={ValueComponent}
                    multiple={false}
                    accept="image/png,image/jpeg"
                  />
                </SimpleGrid>
              </Center>

              <SimpleGrid cols={2}>
                <InputBase
                  w={350}
                  radius="md"
                  label="Nome Completo:"
                  placeholder="Nome Completo"
                  type="text"
                  id="nomeCompleto"
                  value={artesaoState.nomeCompleto}
                  onChange={(e) => handleChange(e.target.value, "nomeCompleto")}
                  required
                />
                <InputBase
                  w={300}
                  radius="md"
                  label="Idade:"
                  id="idade"
                  value={artesaoState.idade || ""}
                  placeholder="21"
                  onChange={handleInputChange}
                  maxLength={2}
                  type="number"
                />
                <InputBase
                  w={350}
                  radius="md"
                  label="Nome do perfil:"
                  placeholder="Nome do perfil"
                  type="text"
                  id="NomeArtesao"
                  value={artesaoState.nomeArtesao}
                  onChange={(e) => handleChange(e.target.value, "nomeArtesao")}
                  required
                />
                <InputBase
                  w={300}
                  radius="md"
                  label="Telefone:"
                  id="Telefone"
                  value={artesaoState.telefone || ""}
                  placeholder="(99) 9 9999-9999"
                  onChange={handleInputChange}
                  maxLength={15}
                //mask="(99) 99999-9999"
                />
                <InputBase
                  w={300}
                  radius="md"
                  label="Whats App:"
                  id="WhatsApp"
                  value={artesaoState.whatsApp || ""}
                  placeholder="(99) 9 9999-9999"
                  onChange={handleInputChange}
                  maxLength={15}
                //mask="(99) 99999-9999"
                />
                <InputBase
                  w={300}
                  radius="md"
                  label="E-mail:"
                  id="Email"
                  value={artesaoState.email || ""}
                  placeholder="email@exemplo.com"
                  onChange={handleInputChange}
                  maxLength={50}
                //mask="(99) 99999-9999"
                />
                <InputBase
                  w={300}
                  radius="md"
                  label="Instagram:"
                  id="Instagram"
                  value={artesaoState.instagram || ""}
                  placeholder="https://www.instagram.com/usuario"
                  onChange={handleInputChange}
                  maxLength={50}
                //mask="(99) 99999-9999"
                />
                <InputBase
                  w={300}
                  radius="md"
                  label="Facebook:"
                  id="Facebook"
                  value={artesaoState.facebook || ""}
                  placeholder="https://www.facebook.com/usuario"
                  onChange={handleInputChange}
                  maxLength={50}
                //mask="(99) 99999-9999"
                />
              </SimpleGrid>
              <InputBase
                w={300}
                radius="md"
                label="Nicho de Atuacao:"
                id="NichoAtuacao"
                value={artesaoState.nichoAtuacao || ""}
                placeholder="Nicho de atuação"
                onChange={handleInputChange}
                maxLength={50}
              />
              <Textarea
                radius="md"
                label="Descrição:"
                resize="vertical"
                placeholder="Descreva sobre a sua marca. min 500 caracteres"
                id="DescricaoPerfil"
                value={artesaoState.descricaoPerfil || ""}
                rows={5}
                onChange={(e) =>
                  handleChange(e.target.value, "descricaoPerfil")
                }
                required
              />
              <Fieldset legend="Informações sobre encomendas">
                <SimpleGrid cols={2} spacing="sm">
                  <Checkbox
                    p="md"
                    id="ReceberEncomendas"
                    label="Aceito receber encomendas."
                    checked={artesaoState.receberEncomendas}
                    onChange={(e) =>
                      handleChange(e.target.checked, "receberEncomendas")
                    }
                  />
                  <Checkbox
                    p="md"
                    id="EnviaEncomendas"
                    label="Aceita enviar encomendas."
                    checked={artesaoState.enviaEncomendas}
                    onChange={(e) =>
                      handleChange(e.target.checked, "enviaEncomendas")
                    }
                  />
                </SimpleGrid>
              </Fieldset>

              {/** Informações de endereço e atuação*/}
              <Fieldset legend="Informações de endereço">
                <SimpleGrid cols={2} mt={5} spacing="">
                  <Checkbox
                    label="Possui local físico"
                    id="LocalFisico"
                    checked={artesaoState.localFisico}
                    onChange={(e) =>
                      handleChange(e.target.checked, "localFisico")
                    }
                  />
                  <Checkbox
                    label="Feira Municipal"
                    id="FeiraMunicipal"
                    checked={artesaoState.feiraMunicipal}
                    onChange={(e) =>
                      handleChange(e.target.checked, "feiraMunicipal")
                    }
                  />
                </SimpleGrid>
                <SimpleGrid cols={3} mt={5} spacing="">
                  <TextInput
                    w={110}
                    required
                    radius="md"
                    label="CEP:"
                    placeholder="00000-000"
                    type="text"
                    id="CEP"
                    value={artesaoState.cep || ""}
                    onChange={(e) =>
                      setArtesaoState({ ...artesaoState, cep: e.target.value })
                    }
                    onBlur={buscarCep} // Chama a função ao perder o foco
                  />
                  <TextInput
                    ml="-101px"
                    w={200}
                    required
                    radius="md"
                    label="Estado:"
                    placeholder="Selecione"
                    type="text"
                    id="estado"
                    value={artesaoState.estado || ""}
                    onChange={(e) => handleChange(e.target.value, "estado")}
                  />
                  <TextInput
                    ml="-130px"
                    w={150}
                    required
                    radius="md"
                    label="Cidade:"
                    placeholder="Selecione"
                    type="text"
                    id="cidade"
                    value={artesaoState.cidade || ""}
                    onChange={(e) => handleChange(e.target.value, "cidade")}
                  />
                </SimpleGrid>
                <SimpleGrid cols={5} mt={5} spacing="xs">
                  <TextInput
                    w={150}
                    required
                    radius="md"
                    label="Rua:"
                    placeholder="Rua lorem ipsum"
                    type="text"
                    id="rua"
                    value={artesaoState.rua || ""}
                    onChange={(e) => handleChange(e.target.value, "rua")}
                  />
                  <TextInput
                    w={150}
                    radius="md"
                    required
                    label="Bairro:"
                    placeholder="Bairro exemplo x"
                    type="text"
                    id="bairro"
                    value={artesaoState.bairro || ""}
                    onChange={(e) => handleChange(e.target.value, "bairro")}
                  />
                  <TextInput
                    w={150}
                    radius="md"
                    label="Complemento:"
                    placeholder="Apto x ou "
                    type="text"
                    id="complemento"
                    value={artesaoState.complemento || ""}
                    onChange={(e) =>
                      handleChange(e.target.value, "complemento")
                    }
                  />
                  <TextInput
                    w={70}
                    radius="md"
                    label="N°:"
                    placeholder="0000"
                    type="text"
                    id="numero"
                    value={artesaoState.numero || ""}
                    onChange={(e) => handleChange(e.target.value, "numero")}
                  />
                  <Checkbox
                    p="xl"
                    ml="-100px"
                    label="Sem N°"
                    id="semNumero"
                    checked={artesaoState.semNumero}
                    onChange={(e) =>
                      handleChange(e.target.checked, "semNumero")}
                  />
                </SimpleGrid>
              </Fieldset>

              {/** Informações de endereço e atuação*/}
              <Button m="md" type="submit" radius="md" color="green">
                Salvar
              </Button>
            </Fieldset>
          </form>
        </Center>
      </Container>
    </section>
  );
};

export default ArtesaoForm;

const mascaraTelefone = (value: string): string => {
  // Remove qualquer caractere não numérico
  const cleaned = value.replace(/\D/g, "");

  // Aplica a máscara com base no tamanho do número
  if (cleaned.length <= 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  }
  return cleaned.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
};
