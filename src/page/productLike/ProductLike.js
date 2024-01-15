import { useEffect, useState } from "react";
import axios from "axios";
import { Box, FormControl, FormLabel, Text } from "@chakra-ui/react";

export function ProductLike() {
  const [productLike, setProductLike] = useState([]);

  useEffect(() => {
    axios.get("/api/productLike").then((response) => {
      console.log(response.data);
      setProductLike(response.data);
    });
  }, []);
  return (
    <Box>
      {/*{productLike.map((bucket) => (*/}
      {/*  <Box>/!*<Text>{bucket.product.product_name}</Text>*!/</Box>*/}
      {/*))}*/}
    </Box>
  );
}
