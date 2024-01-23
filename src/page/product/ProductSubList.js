import { useParams } from "react-router-dom";
import { Text } from "@chakra-ui/react";

export function ProductSubList() {
  const { category_id, subcategory_id } = useParams();
  return (
    <div>
      <Text>category_id : {category_id}</Text>
      <Text>Subcategory id : {subcategory_id}</Text>
    </div>
  );
}
