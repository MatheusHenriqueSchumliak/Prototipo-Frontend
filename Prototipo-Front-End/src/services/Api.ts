import Swal from "sweetalert2";
import axios from "axios";
// Cria a instância
const api = axios.create({
  baseURL: "https://localhost:7058/"
});

// Interceptor Global de Resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Não autorizado",
        text: "Você não tem permissão para acessar este recurso. Por favor, faça login novamente.",
        confirmButtonText: "OK",
      }).then(() => {
        // Limpa o token do localStorage
        localStorage.removeItem("token");
        // Pequeno delay para garantir que o alert desapareça
        setTimeout(() => {
          window.location.href = "/login"; // redireciona para a tela de login
        }, 300); // 300ms já é o suficiente
      });
    }

    // Continua jogando o erro para a função apiRequest
    return Promise.reject(error);
  }
);

export const apiRequest = async <T>(url: string, data?: any, method: string = "POST"): Promise<T> => {
  try {
    const headers: any = {};

    // Adiciona o token ao header
    const token = localStorage.getItem("token");
    //console.log("TOKEN do localStorage:", token); // <- verifique aqui
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Define Content-Type se não for FormData
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await api({
      method,
      url: url,
      data,
      headers,
    });

    return response.data;

  } catch (error: any) {

    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`Erro: ${status} - ${JSON.stringify(data, null, 2)}`);
    } else if (error.code === "ERR_NETWORK") {
      throw new Error("Erro de rede: Não foi possível conectar à API.");
    } else {
      throw new Error("Ocorreu um erro inesperado.");
    }

  }
};