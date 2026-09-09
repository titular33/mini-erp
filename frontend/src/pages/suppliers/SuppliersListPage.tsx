import { Link } from "react-router-dom";
import { useSuppliers } from "../../api/suppliers";

export function SuppliersListPage() {
  const { data: suppliers, isLoading, isError, error } = useSuppliers();

  if (isLoading) return <p>Carregando fornecedores...</p>;
  if (isError) return <p>Erro ao carregar fornecedores: {String(error)}</p>;

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Fornecedores</h1>
        <Link to="/suppliers/new">Novo fornecedor</Link>
      </header>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {suppliers?.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.taxId}</td>
              <td>{supplier.status === "active" ? "Ativo" : "Inativo"}</td>
              <td>
                <Link to={`/suppliers/${supplier.id}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
