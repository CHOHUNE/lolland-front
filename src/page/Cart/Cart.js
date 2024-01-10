import {
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Heading,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function Cart() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState([
    {
      cart_id: 1,
      member_id: 1,
      product_id: 1,
      member_login_id: "user",
      category_name: "TV",
      subcategory_name: "4K",
      product_name: "예시1",
      company_name: "삼성",
      product_price: 35000,
      main_img_url: "https://placehold.co/400",
      count: 2,
    },
    {
      cart_id: 2,
      member_id: 1,
      product_id: 2,
      member_login_id: "user",
      category_name: "노트북",
      subcategory_name: "게이밍 노트북",
      product_name: "예시2",
      company_name: "Intel",
      product_price: 15000,
      main_img_url: "https://placehold.co/700",
      count: 10,
    },
    {
      cart_id: 3,
      member_id: 1,
      product_id: 3,
      member_login_id: "user",
      category_name: "Apple",
      subcategory_name: "iPhone",
      product_name: "예시3",
      company_name: "애플",
      product_price: 45000,
      main_img_url: "https://placehold.co/500",
      count: 7,
    },
    {
      cart_id: 4,
      member_id: 1,
      product_id: 4,
      member_login_id: "user",
      category_name: "TV",
      subcategory_name: "4K",
      product_name: "예시4",
      company_name: "LG",
      product_price: 20000,
      main_img_url: "https://placehold.co/300",
      count: 12,
    },
  ]);
  const { member_id } = useParams();

  useEffect(() => {
    // fetchCart();
  }, []);

  function fetchCart() {
    // axios.get("/api/cart/fetch", { member_id });
  }

  // 전체 선택
  function handleSelectAllProducts(checked) {
    if (checked) {
      setSelectedProducts(productList.map((product) => product.product_id));
    } else {
      setSelectedProducts([]);
    }
  }

  // 개별 선택
  function handleCheckBoxChange(product) {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(product.product_id)
        ? prevSelectedProducts.filter((id) => id !== product.product_id)
        : [...prevSelectedProducts, product.product_id],
    );
  }

  return (
    <>
      <Heading mb={5}>
        <Text as="span" color="skyblue">
          {"{"} member_login_id {"}"}
        </Text>
        님의 카트
      </Heading>
      <TableContainer>
        <Flex justifyContent="space-between" mx={10} mb={5}>
          <Checkbox
            isChecked={selectedProducts.length === productList.length}
            onChange={(e) => handleSelectAllProducts(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <ButtonGroup>
            <Button>선택 삭제</Button>
            <Button>선택 결제</Button>
          </ButtonGroup>
        </Flex>
        <Table>
          <Thead>
            <Tr>
              <Th textAlign="center">선택</Th>
              <Th textAlign="center">상품 이미지</Th>
              <Th textAlign="center">상품명</Th>
              <Th textAlign="center">정보</Th>
              <Th textAlign="center">가격</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productList.map((product) => {
              return (
                <Tr
                  key={product.product_id}
                  // onClick={() => navigate(`product/${product.product_id}`)}
                >
                  <Td
                    textAlign="center"
                    // onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      colorScheme="blue"
                      isChecked={selectedProducts.includes(product.product_id)}
                      onChange={() => {
                        handleCheckBoxChange(product);
                      }}
                    />
                  </Td>
                  <Td textAlign="center" justifyContent="center" display="flex">
                    <Image src={product.main_img_url} w="70px" />
                  </Td>
                  <Td textAlign="center">{product.product_name}</Td>
                  <Td textAlign="center" whiteSpace={"nowrap"}>
                    {product.category_name} {product.subcategory_name}{" "}
                    {product.company_name}
                  </Td>
                  <Td textAlign="center">
                    {product.product_price.toLocaleString()}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
