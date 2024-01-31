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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Select,
  SimpleGrid,
  Spinner,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faChevronRight,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

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

function CategoryPagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  if (!pageInfo) {
    // pageInfo가 null이면 빈 배열을 반환하여 렌더링하지 않음
    return null;
  }

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mb={10} mt={10} display={"flex"} justifyContent={"center"}>
      {pageInfo.prevPageNumber && (
        <PageButton variant={"ghost"} pageNumber={pageInfo.prevPageNumber}>
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
        <PageButton variant={"ghost"} pageNumber={pageInfo.nextPageNumber}>
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

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  const buttonStyle = {
    background: "black",
    borderRadius: "0",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  return (
    <Flex mt={10}>
      <Select
        borderRadius={0}
        defaultValue="all"
        w={"140px"}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">전체</option>
        <option value="product_name">상품명</option>
        <option value="company_name">회사명</option>
      </Select>
      <Input
        borderRadius={0}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button onClick={handleSearch} {...buttonStyle}>
        검색
      </Button>
    </Flex>
  );
}

export function ProductMainList() {
  const { category_id } = useParams();
  const toast = useToast();
  const [category, setCategory] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [hoveredBoardId, setHoveredBoardId] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/product/category/${category_id}?` + params)
      .then((response) => {
        //페이징 작업 시 list가 아니라 map으로 리턴되므로 해당 코드 변경하기
        setProductList(response.data.products); //response.data.products
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        toast({
          title: "카테고리 대분류 별 상품 로딩 중 에러",
          description: error.description,
          status: "error",
        });
      });
  }, [category_id, location]);

  useEffect(() => {
    axios
      .get(`/api/product/category/detail/${category_id}`)
      .then((response) => {
        const { category, subcategories } = response.data;
        setCategory(category);
        setCategoryList(subcategories);
      })
      .catch((error) => {});
  }, [category_id]);

  if (productList === null) {
    return <Spinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  // 전체 너비는 mx 퍼센테이지 증감으로 조절
  return (
    <>
      <Flex flexDir="column" mx="15%" mt="4%">
        <Breadcrumb
          spacing={3}
          separator={<FontAwesomeIcon icon={faChevronRight} />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate("/")}>
              <Heading size="lg" mt={-2}>
                전체보기
              </Heading>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate(`/category/${category_id}`)}
            >
              <Heading size="lg" mt={-2}>
                {category && category.category_name
                  ? category.category_name
                  : ""}
              </Heading>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Divider border="1px solid black" my={5} />
        <HStack w="full">
          {categoryList.map((subcategory) => (
            <Tag
              size="lg"
              py={2}
              px={4}
              _hover={{
                cursor: "pointer",
                bgColor: "black",
                color: "white",
                transition: "0.4s all ease",
              }}
              borderRadius={20}
              bgColor="white"
              border="1px solid #E8E8E8"
              key={subcategory.subcategory_id}
              onClick={() => {
                navigate(
                  `/category/${category_id}/${subcategory.subcategory_id}`,
                );
              }}
            >
              {subcategory.subcategory_name}
            </Tag>
          ))}
        </HStack>
      </Flex>
      <Flex
        mx="15%"
        my="1%"
        flexDir="column"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          mb={10}
          border="1px dashed black"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          w="full"
          h="300px"
        >
          이벤트 배너
        </Box>
        <SimpleGrid h={"100%"} w={"100%"} columns={4} spacing={9}>
          {productList.map((product, index) => (
            <Box
              key={index}
              onMouseEnter={() => {
                if (product.mainImgs && product.mainImgs.length > 1) {
                  setHoveredBoardId(product.product_id);
                }
              }}
              onMouseLeave={() => setHoveredBoardId(null)}
              borderRadius={0}
              _hover={{
                cursor: "pointer",
              }}
              overflow="hidden"
              onClick={() => navigate("/product/" + product.product_id)}
              border={"1px solid #E8E8E8"}
              alignItems={"center"}
              h={"100%"}
            >
              <Box
                position="relative" // 상대 위치 설정
                p={5}
                height="250px"
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

      <Center>
        <VStack>
          <SearchComponent />
          <CategoryPagination pageInfo={pageInfo} />
        </VStack>
      </Center>
    </>
  );
}
