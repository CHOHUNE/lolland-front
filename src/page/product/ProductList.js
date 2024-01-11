import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";

export function ProductList() {
  const [productList, setProductList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/product/list")
      .then((response) => setProductList(response.data));
  }, []);

  if (productList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>상품 목록</Box>
      <Flex w="70%" h={"100%"} display={"flex"} justifyContent={"center"}>
        <SimpleGrid
          h={"100%"}
          w={"80%"}
          justifyContent={"center"}
          alignItems={"center"}
          columns={3}
          spacing={9}
          m={10}
        >
          {productList.map((product) => (
            <Box
              key={product.id}
              onClick={() => navigate("/product/" + product.product_id)}
              _hover={{
                cursor: "pointer",
              }}
            >
              <Flex direction="column" p={4} justifyContent={"center"}>
                <Text>{product.product_name}</Text>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
