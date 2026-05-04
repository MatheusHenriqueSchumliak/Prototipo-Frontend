import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor: inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 without Swal (emits event instead)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async <T>(
  url: string,
  data?: unknown,
  method: string = "POST"
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await api({ method, url, data, headers });
    return response.data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status: number; data: unknown } }).response
    ) {
      const { status, data: errData } = (
        error as { response: { status: number; data: unknown } }
      ).response;
      throw new Error(`Erro: ${status} - ${JSON.stringify(errData, null, 2)}`);
    } else if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "ERR_NETWORK"
    ) {
      throw new Error("Erro de rede: Não foi possível conectar à API.");
    } else {
      throw new Error("Ocorreu um erro inesperado.");
    }
  }
};

export default api;
