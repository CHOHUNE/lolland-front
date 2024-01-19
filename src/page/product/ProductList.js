import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";

function Pagination({ pageInfo }) {
  const navigate = useNavigate();
  const pageNumbers = [];

  if (!pageInfo) {
    // pageInfo가 null이면 빈 배열을 반환하여 렌더링하지 않음
    return null;
  }

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageNumbers.map((pageNumber) => (
        <Button key={pageNumber} onClick={() => navigate("?p=" + pageNumber)}>
          {pageNumber}
        </Button>
      ))}
    </Box>
  );
}

export function ProductList() {
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  const [hoveredBoardId, setHoveredBoardId] = useState(null); // 메인이미지 변경 상태
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();

  const location = useLocation();

  useEffect(() => {
    axios.get("/api/product/list?" + params).then((response) => {
      setProductList(response.data.product);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  // ---------------------------- 로딩로직 ----------------------------
  const FullPageSpinner = () => {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        justifyContent="center"
        alignItems="center"
        backgroundColor="rgba(0,0,0,0.3)"
        zIndex="9999"
      >
        <Spinner size="xl" color="white" />
      </Flex>
    );
  };

  if (productList === null) {
    return <FullPageSpinner />;
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
              key={product.product_id}
              onMouseEnter={() => setHoveredBoardId(product.product_id)} // 마우스 호버 시 상태 변경
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
              h={"320px"}
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
                  width="280px"
                  height="200px"
                  zIndex={1}
                  transition="opacity 0.5s ease-in-out" // 부드러운 투명도 변화
                  opacity={product.id === hoveredBoardId ? 0 : 1} // 호버 상태에 따른 투명도
                />
                {/* 호버 시 이미지 */}
                <Image
                  position="absolute"
                  src={product.mainImgs[1]?.main_img_uri}
                  alt="Hover Image"
                  width="280px"
                  height="200px"
                  zIndex={2}
                  transition="opacity 0.5s ease-in-out" // 부드러운 투명도 변화
                  opacity={product.product_id === hoveredBoardId ? 1 : 0} // 호버 상태에 따른 투명도
                />
              </Box>

              <Flex direction="column" p={4} justifyContent={"center"}>
                <Text>{product.product_name}</Text>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
