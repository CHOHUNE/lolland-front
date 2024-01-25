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
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  List,
  ListItem,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  faChevronRight,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export function ProductSubList() {
  const { category_id, subcategory_id } = useParams();
  const toast = useToast();
  const [productList, setProductList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState(null);
  const [hoveredBoardId, setHoveredBoardId] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/product/category/${category_id}/${subcategory_id}?` + params)
      .then((response) => {
        setProductList(response.data.products); // response.data.products
        setPageInfo(response.data.pageInfo);
      })
      .catch((error) => {
        toast({
          title: "카테고리 소분류 별 상품 로딩 중 에러",
          description: error.description,
          status: "error",
        });
      });
  }, [category_id, subcategory_id, location]);

  useEffect(() => {
    axios
      .get(`/api/product/subcategory/detail/${category_id}/${subcategory_id}`)
      .then((response) => {
        const { categories, companies, category_name, subcategory_name } =
          response.data;
        setCategoryList(categories);
        setCompanyList(companies);
        setCategoryName(category_name);
        setSubcategoryName(subcategory_name);
      });
  }, []);

  if (productList === null) {
    return <Spinner />;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "decimal" }).format(price);
  };

  return (
    <Flex my="3%" mx="15%" flexDir="column">
      <Breadcrumb
        w="full"
        py={3}
        spacing={3}
        separator={<FontAwesomeIcon icon={faChevronRight} />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate(`/category/${category_id}`)}>
            <Heading size="lg" mt={-2}>
              {categoryName ? categoryName : ""}
            </Heading>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() =>
              navigate(`/category/${category_id}/${subcategory_id}`)
            }
          >
            <Heading size="lg" mt={-2}>
              {subcategoryName ? subcategoryName : ""}
            </Heading>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Divider border="1px solid black" my={5} />
      <Flex justifyContent="space-between">
        <Accordion allowMultiple w="20%" defaultIndex={[0, 1]}>
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    카테고리 전체보기
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel whiteSpace="pre-wrap" pb={4}>
                  <List spacing={3}>
                    {categoryList.map((category) => (
                      <ListItem
                        _hover={{ cursor: "pointer" }}
                        key={category.category_id}
                        onClick={() =>
                          navigate(`/category/${category.category_id}`)
                        }
                      >
                        {category.category_name}
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                    브랜드 전체보기
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel whiteSpace="pre-wrap" pb={4}>
                  <List spacing={3}>
                    {companyList.map((company) => (
                      <ListItem
                        _hover={{ cursor: "pointer" }}
                        key={company.company_id}
                      >
                        {company.company_name}
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
        <SimpleGrid h={"100%"} w={"75%"} columns={4} spacing={9}>
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
          {/*@@*/}
          <Box>
            <Button onClick={() => navigate("?p=1")}>1</Button>
            <Button onClick={() => navigate("?p=2")}>2</Button>
            <Button onClick={() => navigate("?p=3")}>3</Button>
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
