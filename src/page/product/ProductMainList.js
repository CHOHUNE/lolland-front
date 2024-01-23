import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";

export function ProductMainList() {
  const { category_id } = useParams();
  const toast = useToast();
  const [productList, setProductList] = useState([]);
  const [hoveredBoardId, setHoveredBoardId] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/product/category/${category_id}`)
      .then((response) => {
        setProductList(response.data.product);
      })
      .catch((error) => {
        toast({
          title: "카테고리 대분류 별 상품 로딩 중 에러",
          description: error.description,
          status: "error",
        });
      });
  }, [category_id, location]);

  if (productList === null) {
    return <Spinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <>
      <Heading textAlign="center">{category_id}번 카테고리 상품 목록</Heading>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Flex
          w="80%"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <SimpleGrid h={"100%"} w={"100%"} columns={4} spacing={9} m={10}>
            {productList.map((product, index) => (
              <Box
                key={index}
                onMouseEnter={() => {
                  // 호버 상태 변경 전에 두 번째 이미지 존재 여부 확인
                  if (product.mainImgs && product.mainImgs.length > 1) {
                    setHoveredBoardId(product.product_id);
                  }
                }}
                onMouseLeave={() => setHoveredBoardId(null)}
                borderRadius="10px"
                boxShadow="md"
                _hover={{
                  cursor: "pointer",
                  // transform: "scale(1.05)",
                  // transition: "transform 0.2s",
                }}
                overflow="hidden"
                onClick={() => navigate("/product/" + product.product_id)}
                border={"1px solid gray"}
                alignItems={"center"}
                h={"100%"}
              >
                <Box
                  position="relative" // 상대 위치 설정
                  p={5}
                  height="200px"
                  width="100%"
                  bg="white"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {/* 마우스 호버 시 2번째 이미지로 변경 */}
                  {/* 기본 이미지 */}
                  <Image
                    position="absolute"
                    src={product.mainImgs[0]?.main_img_uri}
                    alt="Board Image"
                    width="100%"
                    height="100%"
                    zIndex={1}
                    transition="opacity 0.5s ease-in-out" // 부드러운 투명도 변화
                    opacity={product.id === hoveredBoardId ? 0 : 1} // 호버 상태에 따른 투명도
                  />
                  {/* 호버 시 이미지 */}
                  <Image
                    position="absolute"
                    src={product.mainImgs[1]?.main_img_uri}
                    alt="Hover Image"
                    width="100%"
                    height="100%"
                    zIndex={2}
                    transition="opacity 0.5s ease-in-out" // 부드러운 투명도 변화
                    opacity={product.product_id === hoveredBoardId ? 1 : 0} // 호버 상태에 따른 투명도
                  />
                </Box>

                <Flex direction="column" p={4} justifyContent={"center"}>
                  <Text>
                    [{product.company_name}] {product.product_name}
                  </Text>
                  <Text mt={2} fontWeight={"bold"} fontSize={"1.2rem"}>
                    {formatPrice(product.product_price)}원
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>
    </>
  );
}
