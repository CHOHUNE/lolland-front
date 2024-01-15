import {
  AbsoluteCenter,
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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCircleExclamation,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

export function Cart() {
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [memberLoginId, setMemberLoginId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  function fetchCart() {
    axios
      .get("/api/cart/fetch")
      .then((response) => {
        setProductList(response.data.cartDtoList);
        setMemberLoginId(response.data.member_login_id);
      })
      .catch((error) => {
        toast({
          title: "카트 불러오기에 실패하였습니다",
          description: "다시 한번 확인해주세요: " + error.response.status,
          status: "error",
        });
      });
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

  const buttonStyles = {
    variant: "outline",
    border: "1px solid black",
    _hover: { bgColor: "black", color: "white" },
    borderRadius: 0,
  };

  function handleDelete(selectedProducts) {
    axios
      .delete("/api/cart/selected", {
        cart_ids: selectedProducts,
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
    // axios.post() TODO: 결제로 옮기기
  }

  function handleDeleteAll() {
    axios
      .delete("/api/cart/delete")
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

  if (productList === null) {
    return <Spinner />;
  }

  if (productList.length === 0) {
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
        <Button
          leftIcon={<FontAwesomeIcon icon={faHome} />}
          borderRadius={0}
          bgColor="black"
          color="white"
          onClick={() => navigate("/")}
        >
          홈으로 돌아가기
        </Button>
      </Flex>
    );
  }

  return (
    <>
      <Heading my={5} mx={10}>
        <FontAwesomeIcon icon={faBagShopping} />
        <Text as="span" color="orange" ml={3}>
          {memberLoginId}
        </Text>
        님의 장바구니
      </Heading>
      <TableContainer mx={10} mb={10}>
        <Flex justifyContent="space-between" mx={10} mb={5}>
          <Checkbox
            colorScheme="gray"
            isChecked={selectedProducts.length === productList.length}
            onChange={(e) => handleSelectAllProducts(e.target.checked)}
          >
            전체 선택
          </Checkbox>
          <ButtonGroup>
            <Button
              isDisabled={true}
              {...buttonStyles}
              onClick={() => handleDelete(selectedProducts)}
            >
              선택 삭제
            </Button>
            <Button
              isDisabled={true}
              {...buttonStyles}
              onClick={() => handlePurchase(selectedProducts)}
            >
              선택 결제
            </Button>
            <Button
              isDisabled={true}
              {...buttonStyles}
              onClick={() => handleDeleteAll()}
            >
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
                      colorScheme="gray"
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
                    {product.category_name} / {product.subcategory_name}
                  </Td>
                  <Td textAlign="center">{product.company_name}</Td>
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
