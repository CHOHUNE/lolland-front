import { useParams } from "react-router-dom";

export function ProductCatList() {
  const { category_id } = useParams();

  return <div>category id: {category_id}</div>;
}
