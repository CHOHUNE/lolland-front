import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function ProductLike() {
  const [productLike, setProductLike] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/productLike/detilas").then((response) => {
      setProductLike(response.data);
    });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Flex gap={5}>
      {productLike.map((bucket) => (
        <Box
          key={bucket.product_id}
          p={5}
          shadow="md"
          borderWidth="1px"
          align="center"
          w={"300px"}
          h={"270px"}
          border={"1px solid #eeeeee"}
          transition="0.3s ease-in-out"
          _hover={{
            cursor: "pointer",
            transform: "scale(1.1)",
          }}
          onClick={() => navigate("/product/" + bucket.product_id)}
        >
          <VStack w={"200px"} boxSize="150px" flexShrink={0}>
            <Image
              boxSize="full"
              objectFit="cover"
              src={bucket.main_img_uri}
              alt={bucket.product_name}
            />
            <Text fontSize="lg" fontWeight="bold">
              {bucket.product_name}
            </Text>
            <Text fontSize="md">{formatPrice(bucket.product_price)}</Text>
          </VStack>
        </Box>
      ))}
    </Flex>
  );
}
