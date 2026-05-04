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
import { IconCheck, IconLock, IconMail, IconSparkles, IconUser } from "@tabler/icons-react";
import React, { useState, FormEvent, useCallback } from "react";
import { cadastrarUsuario } from "../api/usuarioApi";
import { useNavigate } from "react-router-dom";

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

interface FormValues {
  nome: string;
  email: string;
  senha: string;
}

const UsuarioForm: React.FC = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    nome: "",
    email: "",
    senha: "",
  });

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    errors: {},
    showSuccess: false,
  });

  const validateForm = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!values.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    } else if (values.nome.trim().length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Email deve ter um formato válido";
    }

    if (!values.senha) {
      errors.senha = "Senha é obrigatória";
    } else if (values.senha.length < 6) {
      errors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    return errors;
  }, [values]);

  const updateField = useCallback(
    (field: keyof FormValues, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (formState.errors[field]) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [field]: undefined },
        }));
      }
    },
    [formState.errors]
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormState((prev) => ({ ...prev, errors: validationErrors }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true, errors: {} }));

    try {
      const data = await cadastrarUsuario(values);
      setFormState((prev) => ({ ...prev, showSuccess: true, isLoading: false }));
      setTimeout(() => {
        navigate(`/cadastrar-artesao/${data.id}`);
      }, 1500);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message
          : "Erro ao cadastrar usuário. Tente novamente.";

      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        errors: { email: message },
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
        <Stack align="center" gap="md" mb="xl">
          <ThemeIcon
            size={80}
            radius="xl"
            variant="gradient"
            gradient={{ from: "blue", to: "purple", deg: 45 }}
          >
            <IconSparkles style={{ width: rem(40), height: rem(40) }} stroke={1.5} />
          </ThemeIcon>
          <Title order={2} ta="center">
            Criar Conta
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Preencha seus dados para começar sua jornada
          </Text>
        </Stack>

        <Paper withBorder shadow="xl" p={30} mt={30} radius="md" w={420}>
          {formState.showSuccess && (
            <Alert
              icon={<IconCheck size={16} />}
              title="Sucesso!"
              color="green"
              variant="light"
              mb="md"
              radius="md"
            >
              Usuário cadastrado com sucesso! Redirecionando...
            </Alert>
          )}

          <Stack gap="md">
            <TextInput
              label="Nome completo"
              placeholder="Digite seu nome completo"
              value={values.nome}
              onChange={(e) => updateField("nome", e.target.value)}
              error={formState.errors.nome}
              required
              disabled={formState.isLoading}
              radius="md"
              size="md"
              leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            />
            <TextInput
              label="Email"
              placeholder="Digite seu email"
              type="email"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={formState.errors.email}
              required
              disabled={formState.isLoading}
              radius="md"
              size="md"
              leftSection={<IconMail style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            />
            <PasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              value={values.senha}
              onChange={(e) => updateField("senha", e.target.value)}
              error={formState.errors.senha}
              required
              disabled={formState.isLoading}
              radius="md"
              size="md"
              leftSection={<IconLock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            />
            <Button
              onClick={handleSubmit}
              fullWidth
              loading={formState.isLoading}
              mt="md"
              radius="md"
              size="md"
              variant="gradient"
              gradient={{ from: "blue", to: "purple", deg: 45 }}
            >
              {formState.isLoading ? "Cadastrando..." : "Criar Conta"}
            </Button>
          </Stack>

          <Divider label="ou" labelPosition="center" my="lg" />

          <Group justify="center">
            <Text size="sm" c="dimmed">
              Já tem uma conta?{" "}
              <Anchor size="sm" href="/login">
                Faça login
              </Anchor>
            </Text>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
};

export default UsuarioForm;
