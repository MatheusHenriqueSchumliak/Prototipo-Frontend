import { Container, Center, Fieldset, SimpleGrid, Avatar, FileInput, InputBase, Textarea, Checkbox, TextInput, Button, FileInputProps, Pill, } from "@mantine/core";

import { useNavigate, useParams } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ArtesaoFormProps, ArtesaoModel, defaultArtesao } from "../../../models/ArtesaoModel";
import { atualizaArtesao, cadastrarArtesao } from "../../../services/ArtesaoService";

const ArtesaoForm: React.FC<ArtesaoFormProps> = ({ artesao }) => {
  const usuarioId = localStorage.getItem("usuarioId");
  const [, setFotoUrl] = useState<string | null>(null);
  const [, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  useParams<{ id: string }>();

  const [artesaoState, setArtesaoState] = useState<ArtesaoModel>({
    ...defaultArtesao,
    ...artesao,
    usuarioId: usuarioId || defaultArtesao.usuarioId,
    id: artesao?.id || "00000000-0000-0000-0000-000000000000",
  });

  const handleFileChange = (file: File | null) => {
    setArtesaoState((prevState: any) => ({ ...prevState, imagem: file }));
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
      const response = await fetch(`https://viacep.com.br/ws/${artesaoState.cep}/json/`);
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

        artesaoResultado = await atualizaArtesao(artesaoState.id!, artesaoState as FormData);

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
      console.log(error.response?.data);
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

              <Center>
                <SimpleGrid cols={1} spacing="sm">
                  {" "}
                  {/* Layout em coluna para uma boa disposição */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                    {artesaoState.imagem && (
                      <Avatar variant="default" radius="xl" size={100} alt="Imagem do artesão"
                        src={
                          artesaoState.imagem instanceof File ? URL.createObjectURL(artesaoState.imagem) : Array.isArray(artesaoState.fotoUrl)
                            ? artesaoState.fotoUrl
                            : artesaoState.fotoUrl
                        }
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
                  <FileInput id="imagem" label="Foto de perfil" placeholder="Selecione sua foto" multiple={false} accept="image/png,image/jpeg" valueComponent={ValueComponent} onChange={(file) => handleFileChange(file as File | null)} />
                </SimpleGrid>
              </Center>

              <SimpleGrid cols={2}>
                <InputBase id="nomeCompleto" label="Nome Completo:" placeholder="Nome Completo" type="text" required w={350} radius="md" value={artesaoState.nomeCompleto} onChange={(e) => handleChange(e.target.value, "nomeCompleto")} />
                <InputBase id="idade" label="Idade:" placeholder="21" type="number" maxLength={2} w={300} radius="md" value={artesaoState.idade || ""} onChange={handleInputChange} />
                <InputBase id="nomeArtesao" label="Nome do perfil:" placeholder="Nome do perfil" type="text" required w={350} radius="md" value={artesaoState.nomeArtesao} onChange={(e) => handleChange(e.target.value, "nomeArtesao")} />
                <InputBase id="telefone" label="Telefone:" placeholder="(99) 9 9999-9999" maxLength={15} w={300} radius="md" value={artesaoState.telefone || ""} onChange={handleInputChange} />
                <InputBase id="whatsApp" label="Whats App:" placeholder="(99) 9 9999-9999" maxLength={15} w={300} radius="md" value={artesaoState.whatsApp || ""} onChange={handleInputChange} />
                <InputBase id="email" label="E-mail:" placeholder="email@exemplo.com" maxLength={50} w={300} radius="md" value={artesaoState.email || ""} onChange={handleInputChange} />
                <InputBase id="instagram" label="Instagram:" placeholder="https://www.instagram.com/usuario" maxLength={50} w={300} radius="md" value={artesaoState.instagram || ""} onChange={handleInputChange} />
                <InputBase id="facebook" label="Facebook:" placeholder="https://www.facebook.com/usuario" maxLength={50} w={300} radius="md" value={artesaoState.facebook || ""} onChange={handleInputChange} />
              </SimpleGrid>
              <InputBase id="nichoAtuacao" label="Nicho de Atuacao:" placeholder="Nicho de atuação" maxLength={50} w={300} radius="md" value={artesaoState.nichoAtuacao || ""} onChange={handleInputChange} />
              <Textarea id="descricaoPerfil" label="Descrição:" placeholder="Descreva sobre a sua marca. min 500 caracteres" required rows={5} radius="md" resize="vertical" value={artesaoState.descricaoPerfil || ""} onChange={(e) => handleChange(e.target.value, "descricaoPerfil")} />
              <Fieldset legend="Informações sobre encomendas">
                <SimpleGrid cols={2} spacing="sm">
                  <Checkbox id="receberEncomendas" label="Aceito receber encomendas." p="md" checked={artesaoState.receberEncomendas} onChange={(e) => handleChange(e.target.checked, "receberEncomendas")} />
                  <Checkbox id="enviaEncomendas" label="Aceita enviar encomendas." p="md" checked={artesaoState.enviaEncomendas} onChange={(e) => handleChange(e.target.checked, "enviaEncomendas")} />
                </SimpleGrid>
              </Fieldset>

              {/** Informações de endereço e atuação*/}
              <Fieldset legend="Informações de endereço">
                <SimpleGrid cols={2} mt={5} spacing="">
                  <Checkbox id="localFisico" label="Possui local físico" checked={artesaoState.localFisico} onChange={(e) => handleChange(e.target.checked, "localFisico")} />
                  <Checkbox id="feiraMunicipal" label="Feira Municipal" checked={artesaoState.feiraMunicipal} onChange={(e) => handleChange(e.target.checked, "feiraMunicipal")} />
                </SimpleGrid>
                <SimpleGrid cols={3} mt={5} spacing="">
                  <TextInput id="cep" label="CEP:" placeholder="00000-000" required w={110} radius="md" type="text" value={artesaoState.cep || ""} onChange={(e) => setArtesaoState({ ...artesaoState, cep: e.target.value })} onBlur={buscarCep} />
                  <TextInput id="estado" label="Estado:" placeholder="Selecione" required type="text" ml="-101px" w={200} radius="md" value={artesaoState.estado || ""} onChange={(e) => handleChange(e.target.value, "estado")} />
                  <TextInput id="cidade" label="Cidade:" placeholder="Selecione" required type="text" ml="-130px" w={150} radius="md" value={artesaoState.cidade || ""} onChange={(e) => handleChange(e.target.value, "cidade")} />
                </SimpleGrid>
                <SimpleGrid cols={5} mt={5} spacing="xs">
                  <TextInput id="rua" label="Rua:" placeholder="Rua lorem ipsum" w={150} radius="md" required type="text" value={artesaoState.rua || ""} onChange={(e) => handleChange(e.target.value, "rua")} />
                  <TextInput id="bairro" label="Bairro:" placeholder="Bairro exemplo x" required w={150} radius="md" type="text" value={artesaoState.bairro || ""} onChange={(e) => handleChange(e.target.value, "bairro")} />
                  <TextInput id="complemento" label="Complemento:" placeholder="Apto x ou " w={150} radius="md" type="text" value={artesaoState.complemento || ""} onChange={(e) => handleChange(e.target.value, "complemento")} />
                  <TextInput id="numero" label="N°:" placeholder="0000" w={70} radius="md" type="text" value={artesaoState.numero || ""} onChange={(e) => handleChange(e.target.value, "numero")} />
                  <Checkbox id="semNumero" label="Sem N°" p="xl" ml="-100px" checked={artesaoState.semNumero} onChange={(e) => handleChange(e.target.checked, "semNumero")} />
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
