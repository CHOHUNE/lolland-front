import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Heading,
  Image,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCircleExclamation,
  faHeart,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export function Cart() {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [memberLoginId, setMemberLoginId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  function fetchCart() {
    setLoading(true);
    axios
      .get("/api/cart/fetch")
      .then((response) => {
        setProductList(response.data.cartDtoList);
        setMemberLoginId(response.data.member_login_id);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast({
            title: "권한이 없습니다",
            description: "로그인 후 이용해주세요",
            status: "warning",
          });
          navigate("/login");
        } else {
          toast({
            title: "카트 불러오기에 실패하였습니다",
            description: "다시 한번 확인해주세요: " + error.response.status,
            status: "error",
          });
        }
      });
    setLoading(false);
  }

  // 전체 선택
  function handleSelectAllProducts(checked) {
    if (checked) {
      setSelectedProducts(productList.map((product) => product.cart_id));
    } else {
      setSelectedProducts([]);
    }
  }

  function handleCheckBoxChange(product) {
    const productIdentifier = product.cart_id;

    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.includes(productIdentifier)
        ? prevSelectedProducts.filter((id) => id !== productIdentifier)
        : [...prevSelectedProducts, productIdentifier],
    );
  }

  const buttonStyles = {
    variant: "outline",
    border: "1px solid black",
    _hover: { bgColor: "black", color: "white" },
    borderRadius: 0,
  };

  function handleDelete(selectedProducts) {
    axios
      .delete("/api/cart/delete/selected", {
        headers: {
          "Content-Type": "application/json",
        },
        data: selectedProducts,
      })
      .then(() => {
        toast({
          description: "선택한 상품들을 삭제하였습니다",
          status: "success",
        });
        setSelectedProducts([]);
        fetchCart();
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "선택한 상품들을 삭제하는데 실패하였습니다",
            description: "백엔드 로그를 확인해보세요",
            status: "error",
          });
        } else {
          toast({
            title: "선택한 상품들을 삭제하는데 실패하였습니다",
            description: "다시 한번 시도해보시거나, 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  function handlePurchase(selectedProducts) {
    localStorage.removeItem("purchaseInfo");

    const selectedProductInfo = selectedProducts.map((productId) => {
      const product = productList.find((p) => p.cart_id === productId);
      return {
        productId: product.product_id,
        productName: product.product_name,
        optionId: product.option_id,
        optionName: product.option_name,
        quantity: product.quantity,
        price: product.product_price,
        mainImgUrl: product.main_img_uri,
      };
    });

    // 같은 상품의 다른 옵션만 취합해서 묶기
    const groupedPurchaseInfo = selectedProductInfo.reduce(
      (result, purchase) => {
        const existingEntry = result.find(
          (group) => group.productId === purchase.productId,
        );

        if (existingEntry) {
          existingEntry.options.push({
            optionId: purchase.optionId,
            optionName: purchase.optionName,
            quantity: purchase.quantity,
            price: purchase.price,
          });
        } else {
          result.push({
            productId: purchase.productId,
            mainImgUrl: purchase.mainImgUrl,
            productName: purchase.productName,
            options: [
              {
                optionId: purchase.optionId,
                optionName: purchase.optionName,
                quantity: purchase.quantity,
                price: purchase.price,
              },
            ],
          });
        }

        return result;
      },
      [],
    );

    // Step 3: Save the grouped information to localStorage
    localStorage.setItem("purchaseInfo", JSON.stringify(groupedPurchaseInfo));

    // Step 4: Navigate to the payment page
    navigate("/pay");
  }

  function handleDeleteAll() {
    axios
      .delete("/api/cart/delete/all")
      .then(() => {
        toast({
          description: "장바구니 비우기에 성공하였습니다",
          status: "success",
        });
        fetchCart();
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "장바구니 비우기에 실패하였습니다",
            description: "백엔드 코드를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request - 요청이 잘못되었습니다",
            description: "백엔드와 프론트엔드 코드 연동을 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 401) {
          toast({
            title: "접근 권한이 없습니다",
            description: "로그인 해주세요",
            status: "error",
          });
        } else {
          toast({
            title: "장바구니 비우기에 실패하였습니다",
            description: "다시 시도하시거나 관리자에게 문의하세요",
            status: "error",
          });
        }
      });
  }

  if (loading) {
    return <Spinner />;
  }

  if (!loading && productList.length === 0) {
    return (
      <Flex
        h="80vh"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="8xl" opacity={0.3}>
          <FontAwesomeIcon icon={faCircleExclamation} />
        </Text>
        <Heading mb={10} opacity={0.3}>
          장바구니에 담긴 상품이 없습니다
        </Heading>
        <ButtonGroup>
          <Button
            leftIcon={<FontAwesomeIcon icon={faHeart} />}
            borderRadius={0}
            variant="outline"
            color="black"
            border="1px solid black"
            onClick={() => navigate("/memberPage/productLike")}
          >
            찜한 목록 보기
          </Button>
          <Button
            leftIcon={<FontAwesomeIcon icon={faHome} />}
            borderRadius={0}
            bgColor="black"
            color="white"
            onClick={() => navigate("/")}
          >
            홈으로 돌아가기
          </Button>
        </ButtonGroup>
      </Flex>
    );
  }

  return (
    <Box mx="10%">
      <Text my={5} mx={10} fontSize="3xl" className="specialHeadings">
        <FontAwesomeIcon icon={faBagShopping} />
        <Text as="span" color="orange" ml={3} className="specialHeadings">
          {memberLoginId}
        </Text>
        님의 장바구니
      </Text>
      <TableContainer mx={10} mb={10}>
        <Flex justifyContent="space-between" mx={10} mb={5}>
          <Checkbox
            colorScheme="orange"
            isChecked={
              productList.length > 0 &&
              selectedProducts.length === productList.length
            }
            onChange={(e) => handleSelectAllProducts(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <ButtonGroup>
            <Button
              {...buttonStyles}
              onClick={() => handleDelete(selectedProducts)}
            >
              선택 삭제
            </Button>
            <Button
              {...buttonStyles}
              onClick={() => handlePurchase(selectedProducts)}
            >
              선택 결제
            </Button>
            <Button {...buttonStyles} onClick={() => handleDeleteAll()}>
              전부 비우기
            </Button>
          </ButtonGroup>
        </Flex>
        <Table>
          <Thead>
            <Tr>
              <Th textAlign="center">선택</Th>
              <Th textAlign="center">상품 이미지</Th>
              <Th textAlign="center">상품명</Th>
              <Th textAlign="center">정보</Th>
              <Th textAlign="center">제조사</Th>
              <Th textAlign="center">가격</Th>
              <Th textAlign="center">수량</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productList &&
              productList.map((product) => {
                return (
                  <Tr
                    key={product.cart_id}
                    onClick={() => navigate(`/product/${product?.product_id}`)}
                  >
                    <Td textAlign="center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        colorScheme="orange"
                        isChecked={selectedProducts.includes(product.cart_id)}
                        onChange={() => {
                          handleCheckBoxChange(product);
                        }}
                      />
                    </Td>
                    <Td
                      textAlign="center"
                      justifyContent="center"
                      display="flex"
                    >
                      <Image src={product?.main_img_uri} w="70px" />
                    </Td>
                    <Td textAlign="center">
                      {product?.option_name ? (
                        <Text whiteSpace={"nowrap"}>
                          {product?.product_name} : {product?.option_name}
                        </Text>
                      ) : (
                        <Text whiteSpace={"nowrap"}>
                          {product?.product_name}
                        </Text>
                      )}
                    </Td>
                    <Td textAlign="center" whiteSpace={"nowrap"}>
                      {product?.category_name} / {product?.subcategory_name}
                    </Td>
                    <Td textAlign="center">{product?.company_name}</Td>
                    <Td textAlign="center">
                      <Text color="orange" fontWeight="bold">
                        {(
                          product?.product_price * product?.quantity
                        ).toLocaleString() + "원"}
                      </Text>
                      <Text fontSize="xs">
                        {product?.product_price.toLocaleString() + "원"}
                      </Text>
                    </Td>
                    <Td textAlign="center">{product?.quantity}</Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
