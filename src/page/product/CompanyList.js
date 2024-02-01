import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  border,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
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
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
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

  function handleSearch() {
    const params = new URLSearchParams();
    params.set("k", keyword);

    navigate("?" + params);
  }

  return (
    <Box mt={5}>
      <InputGroup>
        <Input
          borderRadius={0}
          placeholder="검색"
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

export function CompanyList() {
  const { company_id } = useParams();
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState(null);
  const [companyInfo, setCompanyInfo] = useState([]);
  const navigate = useNavigate();
  const [hoveredBoardId, setHoveredBoardId] = useState(null); // 메인이미지 변경 상태
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();

  const location = useLocation();

  useEffect(() => {
    params.append("company_id", company_id);
    axios.get("/api/product/company?" + params).then((response) => {
      setProductList(response.data.product);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  useEffect(() => {
    axios
      .get(`/api/product/company/detail/${company_id}`)
      .then((response) => {
        const { company_name, avg_rate, total_reviews, categories } =
          response.data;
        setCompanyInfo({ company_name, avg_rate, total_reviews });
        setCategoryList(categories);
      })
      .catch((error) => {
        console.log("실패...ㅠ");
      });
  }, [company_id]);

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

  // ------------------------------ 별점 ------------------------------
  function StarRating({ averageRate }) {
    const maxRating = 5;
    const filledStars = Math.floor(averageRate) || 0;

    const stars = Array.from({ length: maxRating }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        style={{ color: index < filledStars ? "#FFE000" : "#EAEAE7" }}
      />
    ));

    return <>{stars}</>;
  }

  // ------------------------------ 출력란 ------------------------------

  function handleFilter(subcategoryId) {
    const params = new URLSearchParams();
    params.set("c", "subcategory");
    params.set("k", subcategoryId);
    navigate("?" + params);
  }

  return (
    <>
      <Box mt={5} display="flex" justifyContent="space-between">
        <Flex
          flexDir="column"
          w={{ base: "33%", md: "28%", lg: "23%", xl: "18%" }}
          px={5}
        >
          <Box p={3}>
            <Heading size="lg">
              {companyInfo ? companyInfo.company_name : ""}
            </Heading>
            <HStack mt={3} mb={5}>
              <Text mr={1}>
                {companyInfo ? (
                  companyInfo.avg_rate !== null ? (
                    <StarRating averageRate={companyInfo.avg_rate} />
                  ) : (
                    <StarRating averageRate={0} />
                  )
                ) : (
                  <StarRating averageRate={0} />
                )}
              </Text>
              <Text opacity={0.5}>
                {companyInfo
                  ? companyInfo.avg_rate !== null
                    ? companyInfo.avg_rate
                    : 0
                  : 0}
              </Text>
              <Text opacity={0.5}>
                (
                {companyInfo
                  ? companyInfo.total_reviews !== null
                    ? companyInfo.total_reviews
                    : 0
                  : 0}
                )
              </Text>
            </HStack>
          </Box>
          {categoryList && (
            <Accordion
              w={"100%"}
              allowMultiple
              defaultIndex={
                categoryList ? categoryList.map((_, index) => index) : []
              }
              id="myAccordian"
            >
              {categoryList.length > 0 &&
                categoryList.map((category) => (
                  <AccordionItem
                    key={category.category_id}
                    className="accordianItem"
                  >
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontWeight="bold"
                      >
                        {category.category_name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel whiteSpace="pre-wrap" pb={4}>
                      <List spacing={3}>
                        {category.subCategory &&
                          category.subCategory.map((subCategory) => (
                            <ListItem
                              key={subCategory.subcategory_id}
                              onClick={() =>
                                handleFilter(subCategory.subcategory_id)
                              }
                            >
                              {subCategory.subcategory_name}
                            </ListItem>
                          ))}
                      </List>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
            </Accordion>
          )}
          <SearchComponent />
        </Flex>
        <Box
          w={{ base: "65%", md: "70%", lg: "75%", xl: "80%" }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"flex-start"}
        >
          <Flex
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              position="fixed"
              top="300"
              right="2"
              zIndex="10"
              p="4"
              bg="rgba(255, 255, 255, 0.1)"
              boxShadow="lg"
              maxW="sm"
              overflow="hidden"
              borderRadius="15px"
            >
              <Recent />
            </Box>
            <SimpleGrid h={"100%"} w={"100%"} columns={4} spacing={10}>
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
                  p={2}
                >
                  <Box
                    position="relative"
                    p={5}
                    height="250px"
                    width="100%"
                    bg="white"
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {/* 기본 이미지 */}
                    <Image
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
        </Box>
      </Box>
      <Pagination pageInfo={pageInfo} />
    </>
  );
}
