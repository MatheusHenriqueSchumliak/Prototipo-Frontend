import { loginUsuario } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import {
  PasswordInput,
  SimpleGrid,
  TextInput,
  Fieldset,
  Button,
  Anchor,
  Group,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../hooks/useAuth";
import type { LoginRequestDTO } from "../types";

const MySwal = withReactContent(Swal);

const initialLoginState: LoginRequestDTO = {
  Email: "",
  Senha: "",
};

export default function LoginPage() {
  const [loginData, setLogin] = useState<LoginRequestDTO>(initialLoginState);
  const navigate = useNavigate();
  const { login: loginFunc } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLogin((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const data = await loginUsuario(loginData);
      loginFunc(data);

      MySwal.fire({
        title: <strong>Login realizado!</strong>,
        html: <text>Você será redirecionado para o cadastro de artesão.</text>,
        icon: "success",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/cadastrar-artesao");
      });
    } catch (error) {
      let errorMessage =
        "Ocorreu um erro ao realizar o login. Por favor, tente novamente.";
      if (error && typeof error === "object" && "message" in error) {
        errorMessage += ` ${(error as { message?: string }).message}`;
      }

      MySwal.fire({
        title: <strong>Erro ao realizar login!</strong>,
        html: <text>{errorMessage}</text>,
        icon: "error",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/login");
      });
    }
  };

  return (
    <section>
      <Stack
        h="100vh"
        bg="var(--mantine-color-body)"
        align="Center"
        justify="center"
        gap="xs"
      >
        <Title>LOGIN</Title>
        <Fieldset w={360}>
          <form onSubmit={handleSubmit}>
            <SimpleGrid cols={1}>
              <TextInput
                radius="md"
                label="E-mail:"
                placeholder="E-mail"
                id="Email"
                value={loginData.Email}
                onChange={handleChange}
                required
              />
              <div>
                <Group p="apart" mb="xs"></Group>
                <PasswordInput
                  radius="md"
                  label="Senha:"
                  placeholder="Senha"
                  id="Senha"
                  value={loginData.Senha}
                  onChange={handleChange}
                  required
                />
                <Anchor href="#">Esqueceu a senha?</Anchor>
              </div>
              <Button type="submit" radius="md">
                Entrar
              </Button>
              <div>
                <hr />
              </div>
              <SimpleGrid cols={2}>
                <Text>Não possui cadastro?</Text>
                <Anchor href="/cadastrar-usuario">Cadastre-se</Anchor>
              </SimpleGrid>
            </SimpleGrid>
          </form>
        </Fieldset>
      </Stack>
    </section>
  );
}
