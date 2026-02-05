// import { UsuarioModel } from "../models/UsuarioModel";
// import React, { useState, FormEvent } from "react";
// import { cadastrarUsuario } from "../services/UsuarioService";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   PasswordInput,
//   SimpleGrid,
//   Container,
//   TextInput,
//   Fieldset,
//   Center,
//   Button,
//   Title,
//   Text,
// } from "@mantine/core";

// const UsuarioForm: React.FC = () => {
//   const navigate = useNavigate();
//   const [, setErrorMessage] = useState<string | null>(null);
//   const [usuario, setUsuario] = useState<UsuarioModel>({
//     Id: "",
//     Nome: "",
//     Email: "",
//     SenhaHash: "",
//     Role: "Usuario",
//     ArtesaoId: "",
//   });

//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault();

//     console.log(
//       "Tentando cadastrar usuário:",
//       JSON.stringify(usuario, null, 2)
//     );

//     try {
//       const data = await cadastrarUsuario(usuario);
//       // Logs de sucesso
//       console.log(
//         "Usuário cadastrado com sucesso. Dados retornados da API:",
//         JSON.stringify(data, null, 2)
//       );
//       // Feedback ao usuário
//       alert("Usuário cadastrado com sucesso!");
//        // Redireciona para a página de cadastro de artesão, enviando o ID do usuário
//        navigate(`/CadastrarArtesao/${data.Id}`);
//     } catch (error: any) {
//       // Captura e exibe mensagens de erro detalhadas
//       setErrorMessage(error.message);
//       console.error("Erro ao cadastrar usuário:", error.message || error);
//     }
//   };

//   return (
//     <section>
//       <Container>
//         <Center>
//           <Title>Cadastre seu usuário</Title>
//         </Center>
//         <Center>
//           <Fieldset>
//             <form onSubmit={handleSubmit}>
//               <SimpleGrid cols={1}>
//                 <TextInput
//                   w={300}
//                   radius="md"
//                   label="Nome:"
//                   placeholder="Nome"
//                   type="text"
//                   id="nome"
//                   value={usuario.Nome}
//                   onChange={(e) =>
//                     setUsuario({ ...usuario, Nome: e.target.value })
//                   }
//                   required
//                 />
//                 <TextInput
//                   w={300}
//                   radius="md"
//                   label="E-mail:"
//                   placeholder="seuEmail@email.com"
//                   id="email"
//                   value={usuario.Email}
//                   onChange={(e) =>
//                     setUsuario({ ...usuario, Email: e.target.value })
//                   }
//                   required
//                 />

//                 <PasswordInput
//                   w={300}
//                   radius="md"
//                   label="Senha:"
//                   placeholder="Senha"
//                   id="senha"
//                   value={usuario.SenhaHash}
//                   onChange={(e) =>
//                     setUsuario({ ...usuario, SenhaHash: e.target.value })
//                   }
//                   required
//                 />
//                 <Button type="submit" radius="md">
//                   Cadastrar
//                 </Button>
//                 <div>
//                   <hr />
//                 </div>
//                 <Center>
//                   <Link to="/Login">
//                     <Text>Entrar com e-mail e senha</Text>
//                   </Link>
//                 </Center>
//               </SimpleGrid>
//             </form>
//           </Fieldset>
//         </Center>
//       </Container>
//     </section>
//   );
// };
// export default UsuarioForm;
// components/UsuarioForm.tsx
import React, { useState, FormEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  PasswordInput,
  Container,
  TextInput,
  Button,
  Title,
  Text,
  Alert,
  Anchor,
  Box,
  Divider,
  Group,
  Paper,
  rem,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCheck,
  IconLock,
  IconMail,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react";
import { UsuarioModel } from "../models/UsuarioModel";
import { cadastrarUsuario } from "../services/UsuarioService";

// Tipos para validação
interface ValidationErrors {
  nome?: string;
  email?: string;
  senha?: string;
}

interface FormState {
  isLoading: boolean;
  errors: ValidationErrors;
  showSuccess: boolean;
}

const UsuarioForm: React.FC = () => {
  const navigate = useNavigate();

  // Estados separados para melhor organização
  const [usuario, setUsuario] = useState<UsuarioModel>({
    Id: "",
    Nome: "",
    Email: "",
    SenhaHash: "",
    Role: "Usuario",
    ArtesaoId: "",
  });

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    errors: {},
    showSuccess: false,
  });

  // Função de validação
  const validateForm = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validação do nome
    if (!usuario.Nome.trim()) {
      errors.nome = "Nome é obrigatório";
    } else if (usuario.Nome.trim().length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!usuario.Email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!emailRegex.test(usuario.Email)) {
      errors.email = "Email deve ter um formato válido";
    }

    // Validação da senha
    if (!usuario.SenhaHash) {
      errors.senha = "Senha é obrigatória";
    } else if (usuario.SenhaHash.length < 6) {
      errors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    return errors;
  }, [usuario]);

  // Função para atualizar campos do usuário
  const updateUsuario = useCallback(
    (field: keyof UsuarioModel, value: string) => {
      setUsuario((prev) => ({ ...prev, [field]: value }));

      // Limpa erro do campo quando o usuário começar a digitar
      if (formState.errors[field as keyof ValidationErrors]) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [field]: undefined },
        }));
      }
    },
    [formState.errors]
  );

  // Função de submit
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validação
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormState((prev) => ({ ...prev, errors: validationErrors }));
      return;
    }

    // Inicia carregamento
    setFormState((prev) => ({ ...prev, isLoading: true, errors: {} }));

    console.log(
      "Tentando cadastrar usuário:",
      JSON.stringify(usuario, null, 2)
    );

    try {
      const data = await cadastrarUsuario(usuario);

      console.log(
        "Usuário cadastrado com sucesso:",
        JSON.stringify(data, null, 2)
      );

      // Mostra sucesso
      setFormState((prev) => ({
        ...prev,
        showSuccess: true,
        isLoading: false,
      }));

      // Aguarda um pouco para mostrar o sucesso antes de navegar
      setTimeout(() => {
        navigate(`/CadastrarArtesao/${data.Id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao cadastrar usuário:", error.message || error);

      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        errors: {
          email: error.message || "Erro ao cadastrar usuário. Tente novamente.",
        },
      }));
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: rem(16),
      }}
    >
      <Container size={420} my={40}>
        {/* Cabeçalho com ícone moderno */}
        <Stack align="center" gap="md" mb="xl">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="gradient"
            gradient={{ from: "blue", to: "purple", deg: 45 }}
            style={{
              boxShadow: "0 20px 40px rgba(255, 7, 7, 0.1)",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.05)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
          >
            <IconSparkles
              style={{ width: rem(40), height: rem(40) }}
              stroke={1.5}
            />
          </ThemeIcon>

          <Title
            order={2}
            ta="center"
          
          >
            Criar Conta
          </Title>

          <Text c="dimmed" size="sm" ta="center">
            Preencha seus dados para começar sua jornada
          </Text>
        </Stack>

        <Paper
          withBorder
          shadow="xl"
          p={30}
          mt={30}
          radius="md"
          w={420}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Alerta de sucesso */}
          {formState.showSuccess && (
            <Alert
              icon={<IconCheck size={16} />}
              title="Sucesso!"
              color="green"
              variant="light"
              mb="md"
              radius="md"
              style={{
                animation: "slideInFromTop 0.3s ease-out",
              }}
            >
              Usuário cadastrado com sucesso! Redirecionando...
            </Alert>
          )}

          <Stack gap="md">
            {/* Campo Nome */}
            <TextInput
              label="Nome completo"
              placeholder="Digite seu nome completo"
              value={usuario.Nome}
              onChange={(e) => updateUsuario("Nome", e.target.value)}
              error={formState.errors.nome}
              required
              disabled={formState.isLoading}
              radius="md"
              size="md"
              leftSection={
                <IconUser
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              styles={{
                input: {
                  backgroundColor: "rgba(248, 250, 252, 0.8)",
                  border: "2px solid rgba(226, 232, 240, 0.8)",
                  transition: "all 0.3s ease",
                  "&:focus": {
                    backgroundColor: "white",
                    borderColor: "#667eea",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                  },
                  "&:hover": {
                    borderColor: "rgba(148, 163, 184, 0.8)",
                  },
                },
              }}
            />

            {/* Campo Email */}
            <TextInput
              label="Email"
              placeholder="Digite seu email"
              type="email"
              value={usuario.Email}
              onChange={(e) => updateUsuario("Email", e.target.value)}
              error={formState.errors.email}
              required
              disabled={formState.isLoading}
              radius="md"
              size="md"
              leftSection={
                <IconMail
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              styles={{
                input: {
                  backgroundColor: "rgba(248, 250, 252, 0.8)",
                  border: "2px solid rgba(226, 232, 240, 0.8)",
                  transition: "all 0.3s ease",
                  "&:focus": {
                    backgroundColor: "white",
                    borderColor: "#667eea",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                  },
                  "&:hover": {
                    borderColor: "rgba(148, 163, 184, 0.8)",
                  },
                },
              }}
            />

            {/* Campo Senha */}
            <PasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              value={usuario.SenhaHash}
              onChange={(e) => updateUsuario("SenhaHash", e.target.value)}
              error={formState.errors.senha}
              required
              disabled={formState.isLoading}
              radius="md"
              size="md"
              leftSection={
                <IconLock
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              styles={{
                input: {
                  backgroundColor: "rgba(248, 250, 252, 0.8)",
                  border: "2px solid rgba(226, 232, 240, 0.8)",
                  transition: "all 0.3s ease",
                  "&:focus": {
                    backgroundColor: "white",
                    borderColor: "#667eea",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                  },
                  "&:hover": {
                    borderColor: "rgba(148, 163, 184, 0.8)",
                  },
                },
              }}
            />

            {/* Botão de Submit */}
            <Button
              onClick={handleSubmit}
              fullWidth
              loading={formState.isLoading}
              mt="md"
              radius="md"
              size="md"
              variant="gradient"
              gradient={{ from: "blue", to: "purple", deg: 45 }}
              style={{
                height: rem(48),
                fontSize: rem(16),
                fontWeight: 600,
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                },
              }}
              styles={{
                root: {
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                  },
                },
              }}
            >
              {formState.isLoading ? "Cadastrando..." : "Criar Conta"}
            </Button>
          </Stack>

          {/* Divisor */}
          <Divider
            label="ou"
            labelPosition="center"
            my="lg"
            styles={{
              label: {
                color: "rgba(107, 114, 128, 0.8)",
                fontWeight: 500,
              },
            }}
          />

          {/* Link para login */}
          <Group justify="center">
            <Text size="sm" c="dimmed">
              Já tem uma conta?{" "}
              <Anchor
                size="sm"
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.textDecoration = "none")
                }
              >
                Faça login
              </Anchor>
            </Text>
          </Group>
        </Paper>
      </Container>

      {/* Estilos CSS customizados */}
      <style>{`
        @keyframes slideInFromTop {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default UsuarioForm;
