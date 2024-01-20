import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import * as PropTypes from "prop-types";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  function handleClick() {
    params.set("p", pageNumber);
    navigate("?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

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
    <Box mb={10} mt={6} display={"flex"} justifyContent={"center"}>
      {pageInfo.prevPageNumber && (
        <PageButton variant="ghost" pageNumber={pageInfo.prevPageNumber}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </PageButton>
      )}

      {pageNumbers.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          pageNumber={pageNumber}
        >
          {pageNumber}
        </PageButton>
      ))}

      {pageInfo.nextPageNumber && (
        <PageButton variant="ghost" pageNumber={pageInfo.nextPageNumber}>
          <FontAwesomeIcon icon={faAngleRight} />
        </PageButton>
      )}
    </Box>
  );
}

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);

    navigate("?" + params);
  }

  return (
    <Flex display={"flex"} justifyContent={"center"}>
      <Box>
        <Select w={"120px"} onChange={(e) => setCategory(e.target.value)}>
          <option selected value="all">
            전체
          </option>
          <option value="product_name">상품명</option>
          <option value="company_name">회사명</option>
        </Select>
      </Box>
      <Box>
        <Input
          w={"300px"}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={handleSearch}>검색</Button>
      </Box>
    </Flex>
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

  // ------------------------------ 가격 ex) 1,000 ,로 구분지어 보여지게 처리 ------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Box mt={5}>
      <Box
        fontSize={"2rem"}
        fontWeight={"bold"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        상품 목록
      </Box>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
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
      <SearchComponent />
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
