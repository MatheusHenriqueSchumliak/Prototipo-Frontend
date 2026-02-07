import React, { useRef, useState } from "react";

export default function Teste() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [progress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Compressão da imagem (opcional)
      // ...

      // Upload da imagem (opcional)
      // ...
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      // Criar um FormData para enviar o arquivo
      const formData = new FormData();
      formData.append("image", selectedImage);

      // Enviar o FormData para o servidor
    //   fetch("/upload", {
    //     method: "POST",
    //     body: formData,
    //     onUploadProgress: (progressEvent) => {
    //       setProgress(
    //         Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //       );
    //     },
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Erro ao enviar o arquivo");
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log("Arquivo enviado com sucesso:", data);
    //     })
    //     .catch((error) => {
    //       console.error("Erro ao enviar o arquivo:", error);
    //     });
    }
  };

  return (
    <div>
      <input type="file" ref={inputRef} onChange={handleImageChange} />
      {preview && <img src={preview as string} alt="Preview" />}
      <button onClick={handleUpload} disabled={!selectedImage}>
        Enviar
      </button>
      <progress value={progress} max="100" />
    </div>
  );
}
