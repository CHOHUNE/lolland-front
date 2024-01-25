import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Recent = () => {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // 로컬 스토리지에서 최근 본 상품 목록 로드
    const loadedRecent = JSON.parse(localStorage.getItem("recent")) || [];
    setRecent(loadedRecent);
  }, []);

  const truncateText = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드러운 스크롤 효과
    });
  };

  return (
    <Box fontSize={"10px"}>
      <Heading size="md" mb={3}>
        최근 본 상품
      </Heading>
      {recent.map((item, index) => (
        <Flex
          key={index}
          justifyContent={"center"}
          cursor="pointer"
          onClick={() => handleNavigateToProduct(item.product_id)}
          borderBottom={"1px solid gray"}
        >
          <VStack>
            <Image
              src={item.mainImgUrl || "기본 이미지 URL"}
              alt={"Product Image"}
              boxSize="50px"
              mb={1}
              mt={1}
            />
            <Text fontWeight="bold" noOfLines={1}>
              {truncateText(item.productName, 10)}
            </Text>
          </VStack>
        </Flex>
      ))}
      <Button w={"100%"} bg={"black"} color="white" onClick={scrollToTop}>
        TOP
      </Button>
    </Box>
  );
};
