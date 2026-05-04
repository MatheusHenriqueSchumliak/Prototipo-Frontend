import { Container, Table, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { listarUsuarios } from "../api/usuarioApi";

export default function ListarUsuariosPage() {
  const { data: usuarios = [], isLoading, error } = useQuery({
    queryKey: ["usuarios"],
    queryFn: listarUsuarios,
  });

  return (
    <section>
      <Container>
        <Text size="xl" mb="lg">
          Lista de Usuários
        </Text>

        {isLoading ? (
          <Loader size="xl" />
        ) : error ? (
          <Text c="red">Erro ao carregar os usuários</Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>E-mail</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {usuarios.map((u) => (
                <Table.Tr key={u.id}>
                  <Table.Td>{u.nome}</Table.Td>
                  <Table.Td>{u.email}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Container>
    </section>
  );
}
