// features/artesao/types.ts

// Espelho do backend — o que vem/vai pela API
export interface ArtesaoDTO {
  id?: string;
  usuarioId?: string;
  nomeCompleto?: string;
  // ... campos vindos do .NET
}

// O que o formulário usa — pode ter campos extras de UI
export interface ArtesaoFormValues {
  imagem?: File | null;  // só existe no front, não vai para a API
  // ... campos editáveis
}