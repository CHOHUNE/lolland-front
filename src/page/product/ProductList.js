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
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import * as PropTypes from "prop-types";
import { Recent } from "../../component/RecentViewed";

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
    <Box mx="35%">
      <InputGroup>
        <InputLeftElement w="25%">
          <Select
            border="1px solid black"
            borderRadius={0}
            defaultValue="all"
            _focus={{ border: "1px solid black", shadow: "none" }}
            _hover={{ border: "1px solid black" }}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="product_name">상품명</option>
            <option value="company_name">회사명</option>
          </Select>
        </InputLeftElement>
        <Input
          borderRadius={0}
          textIndent="25%"
          placeholder="검색어를 입력해주세요"
          border="1px solid black"
          _focus={{ border: "1px solid black", shadow: "none" }}
          _hover={{ border: "1px solid black" }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <InputRightElement bgColor="black" onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} color="white" />
        </InputRightElement>
      </InputGroup>
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

  // ------------------------------ 가격 ex) 1,000 ,로 구분지어 보여지게 처리 ------------------------------
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Box mt={10}>
      <SearchComponent />
      <Flex
        mx="10%"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          position="fixed" // 절대 위치를 사용해 오버레이 설정
          top="300" // 배너의 상단에서 시작
          right="2" // 배너의 우측에서 시작
          zIndex="10" // 다른 요소보다 위에 오도록 z-index 설정
          p="4" // 패딩 값
          bg="rgba(255, 255, 255, 0.1)" // 배경색
          boxShadow="lg" // 그림자 효과
          maxW="sm" // 최대 너비 설정
          overflow="hidden" // 내용이 넘치면 숨김
          borderRadius="15px"
        >
          <Recent />
        </Box>
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
              borderRadius={0}
              _hover={{
                cursor: "pointer",
                // transform: "scale(1.05)",
                // transition: "transform 0.2s",
              }}
              overflow="hidden"
              onClick={() => navigate("/product/" + product.product_id)}
              border={"1px solid #E8E8E8"}
              alignItems={"center"}
              h={"100%"}
            >
              <Box
                position="relative"
                p={5}
                height="250px"
                width="100%"
                bg="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {/* 마우스 호버 시 2번째 이미지로 변경 */}
                {/* 기본 이미지 */}
                <Image
                  className="product-image"
                  position="absolute"
                  src={product.mainImgs[0]?.main_img_uri}
                  alt="Board Image"
                  width="100%"
                  height="100%"
                  zIndex={1}
                  transition="opacity 0.5s ease-in-out"
                  opacity={product.id === hoveredBoardId ? 0 : 1}
                />
                {/* 호버 시 이미지 */}
                <Image
                  className="product-image"
                  position="absolute"
                  src={product.mainImgs[1]?.main_img_uri}
                  alt="Hover Image"
                  width="100%"
                  height="100%"
                  zIndex={2}
                  transition="opacity 0.5s ease-in-out"
                  opacity={product.product_id === hoveredBoardId ? 1 : 0}
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
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
