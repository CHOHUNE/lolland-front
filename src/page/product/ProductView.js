import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart as fasHeart,
} from "@fortawesome/free-solid-svg-icons"; // 꽉 찬 하트
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"; // 빈 하트

export function ProductView() {
  const [product, setProduct] = useState(null);

  const { product_id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    axios
      .get("/api/product/product_id/" + product_id)
      .then((response) => setProduct(response.data));
  }, []);

  if (product === null) {
    return <Spinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <Box w="100%" p={5}>
      <Flex>
        {product.category_name} > {product.subcategory_name}
      </Flex>
      <Flex
        direction="row"
        justify="center"
        align="center"
        maxW="1200px"
        m="auto"
      >
        {/* 메인 이미지 */}
        <Box p={2}>
          {product.mainImgUrls && product.mainImgUrls.length > 0 && (
            <Image
              src={product.mainImgUrls[currentImageIndex]}
              alt={product.product_name}
              boxSize="400px"
              objectFit="contain"
            />
          )}
          {/* 썸네일 이미지 */}
          <HStack justifyContent={"center"} mt={2}>
            {product.mainImgUrls &&
              product.mainImgUrls.map((imgUrl, index) => (
                <Box key={index} onMouseEnter={() => selectImage(index)}>
                  <Image src={imgUrl} boxSize="100px" objectFit="cover" />
                </Box>
              ))}
          </HStack>
        </Box>

        {/* 상품 정보 컨테이너 */}
        <VStack w="60%" ml={5}>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              상품명
            </FormLabel>
            <Box mt={-2} border={"none"} flex={1}>
              {product.product.product_name}
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              금액
            </FormLabel>
            <Box fontWeight={400} mt={-2} border={"none"} flex={1}>
              {formatPrice(product.product.product_price)}원
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              상품설명
            </FormLabel>
            <Box fontWeight={400} mt={-2} border={"none"} flex={1}>
              {product.product.product_content}
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              재고
            </FormLabel>
            <Box fontWeight={400} mt={-2} border={"none"} flex={1}>
              {product.product.total_stock}개
            </Box>
          </HStack>
          <HStack w={"100%"} h={"auto"} borderBottom={"1px solid #eeeeee"}>
            <FormLabel w={"100px"} fontWeight="bold">
              제조사
            </FormLabel>
            <Text fontWeight={400} mt={-2} border={"none"} flex={1}>
              {product.company_name}
            </Text>
          </HStack>

          <Flex w={"100%"} mt={10}>
            {/* --------------- 찜하기 --------------- */}
            <Button
              h={"50px"}
              w={"20%"}
              bg={"none"}
              borderRadius={0}
              border={"1px solid #eeeeee"}
              onClick={() => setIsFavorited(!isFavorited)} // 클릭 시 상태 토글
            >
              <FontAwesomeIcon icon={isFavorited ? fasHeart : farHeart} />
            </Button>
            <Button
              h={"50px"}
              w={"30%"}
              borderRadius={0}
              bg={"none"}
              border={"1px solid #eeeeee"}
            >
              <FontAwesomeIcon icon={faCartShopping} />
            </Button>
            <Button
              h={"50px"}
              w={"50%"}
              borderRadius={0}
              bg={"black"}
              color={"white"}
              border={"1px solid #eeeeee"}
              _hover={{ color: "black", background: "gray.300" }}
            >
              구매하기
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
}
