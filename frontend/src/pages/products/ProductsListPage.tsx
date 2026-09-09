import { Link } from "react-router-dom";
import { useProducts } from "../../api/products";

export function ProductsListPage() {
  const { data: products, isLoading, isError, error } = useProducts();

  if (isLoading) return <p>Carregando produtos...</p>;
  if (isError) return <p>Erro ao carregar produtos: {String(error)}</p>;

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Produtos</h1>
        <Link to="/products/new">Novo produto</Link>
      </header>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nome</th>
            <th>Unidade</th>
            <th>Estoque atual</th>
            <th>Estoque mínimo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => {
            const belowMin = product.currentStock < product.minStock;
            return (
              <tr key={product.id} style={belowMin ? { color: "crimson" } : undefined}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.unit}</td>
                <td>{product.currentStock}</td>
                <td>{product.minStock}</td>
                <td>
                  <Link to={`/products/${product.id}`}>Editar</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
