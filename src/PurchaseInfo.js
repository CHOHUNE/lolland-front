import {
  Form,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  List,
  ListItem,
  SimpleGrid,
  Tag,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./component/LoginProvider";
import axios from "axios";
import * as PropTypes from "prop-types";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

function Input(props) {
  return null;
}

Input.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.string,
};

export function PurchaseInfo() {
  const { orderId } = useParams();
  const { isAuthenticated, hasAccess } = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState();
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/payment/order-info?orderId=${orderId}`)
      .then((response) => {
        setOrderInfo(response.data);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "불러오는 도중 에러",
            description: "백엔드 코드를 확인해주세요",
            status: "error",
          });
        } else if (error.response.status === 401) {
          toast({
            title: "권한이 없습니다",
            description: "재로그인 혹은 관리자에게 문의 바랍니다",
            status: "error",
          });
        } else {
          toast({
            title: "구매 상세 내역을 불러오던 도중 에러 발생",
            description: "다시 한 번 시도하시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }, []);

  function cancelOrderRequest() {
    axios
      .post("/api/payment/cancel-wait", { orderId: orderInfo.order_nano_id })
      .then((response) => {
        toast({
          title: "주문 취소 요청에 성공했습니다",
          description: "관리자가 승인한 뒤에 환불 가능합니다",
          status: "success",
        });
        navigate("/memberPage");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            description: "요청 중 500",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            description: "400",
            status: "error",
          });
        } else {
          toast({
            title: "주문 취소 요청에 실패했습니다",
            description: "다시 한 번 시도해주시거나, 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  const toggleAdditionalInfo = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };

  const labelStyles = {
    textAlign: "left",
    fontWeight: "bold",
  };

  const dataStyles = {
    textAlign: "right",
  };

  const formatOrderDate = (orderRegTime) => {
    const formattedDate = format(new Date(orderRegTime), "yyyy.MM.dd HH:mm");
    return formattedDate;
  };

  const getStatusStyle = (orderStatus) => {
    switch (orderStatus) {
      case "ORDERED":
        return { color: "#6FA7DD", colorScheme: "blue", content: "결제 완료" };
      case "ORDERING":
        return { color: "orange", colorScheme: "orange", content: "주문 중" };
      case "CANCEL_WAIT":
        return {
          color: "red",
          colorScheme: "red",
          content: "결제 취소 대기 중",
        };
      case "CANCELED":
        return { color: "gray", colorScheme: "gray", content: "결제 취소" };
      default:
        return {
          color: "orange",
          colorScheme: "orange",
          content: "Unknown Status",
        };
    }
  };

  function formatPhoneNumber(phoneNumber) {
    const cleaned = ("" + phoneNumber).replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/); // Match groups of digits
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  }

  return (
    <Card w="70%">
      {orderInfo && (
        <>
          <CardHeader p={10}>
            <Heading textAlign="left" mb={5}>
              결제 내역 상세정보
            </Heading>
            <HStack>
              <Tag
                colorScheme={getStatusStyle(orderInfo.order_status).colorScheme}
                variant="outline"
                borderRadius="full"
                px={3}
                mr={3}
              >
                {getStatusStyle(orderInfo.order_status).content}
              </Tag>
              <Text as="span" fontSize="lg">
                {orderInfo.order_name}
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid
              columns={2}
              spacing={10}
              px={10}
              gridTemplateColumns="100px 1fr"
            >
              <Box {...labelStyles}>주문명</Box>
              <Box {...dataStyles}>{orderInfo.order_name}</Box>
              <Box {...labelStyles}>주문 번호</Box>
              <Box {...dataStyles}>{orderInfo.order_nano_id}</Box>
              <Box {...labelStyles}>주문 시간</Box>
              <Box {...dataStyles}>
                {formatOrderDate(orderInfo.order_reg_time)}
              </Box>
              <Box display="flex" alignItems="center" {...labelStyles}>
                주문 상품
              </Box>
              <Box>
                <List>
                  {orderInfo.productList.map((product) => (
                    <ListItem key={product.product_id} {...dataStyles}>
                      {product.product_name} {product.option_name} (
                      {product.quantity}개)
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box {...labelStyles}>배송비</Box>
              <Box {...dataStyles}>3,000원</Box>
              <Box {...labelStyles}>주문 금액</Box>
              <Box {...dataStyles}>
                {orderInfo.total_price.toLocaleString()}원
              </Box>
              {showAdditionalInfo && (
                <>
                  <Box {...labelStyles}>받는 사람</Box>
                  <Box {...dataStyles}>{orderInfo.receiver}</Box>
                  <Box {...labelStyles}>휴대폰 번호</Box>
                  <Box {...dataStyles}>
                    {formatPhoneNumber(orderInfo.phone)}
                  </Box>
                  <Box {...labelStyles}>이메일</Box>
                  <Box {...dataStyles}>{orderInfo.email}</Box>
                  <Box {...labelStyles}>배송지</Box>
                  <Box {...dataStyles}>
                    {orderInfo.address} ({orderInfo.postalCode})
                  </Box>
                  <Box {...labelStyles}>배송 시 요청사항</Box>
                  <Box {...dataStyles}>
                    {orderInfo.requirement === ""
                      ? "없음"
                      : orderInfo.requirement}
                  </Box>
                </>
              )}
              <Box gridColumn="span 2" textAlign="center">
                <IconButton
                  variant="ghost"
                  w="full"
                  onClick={toggleAdditionalInfo}
                  icon={
                    showAdditionalInfo ? (
                      <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronDown} />
                    )
                  }
                />
              </Box>
            </SimpleGrid>
          </CardBody>
          <CardFooter display="flex" justifyContent="center">
            <ButtonGroup justifyContent="center" w="full">
              <Button w="40%" onClick={() => navigate(-1)}>
                돌아가기
              </Button>
              <Button
                w="40%"
                colorScheme="red"
                onClick={() => cancelOrderRequest()}
                isDisabled={
                  orderInfo.order_status === "CANCELED" ||
                  orderInfo.order_status === "CANCEL_WAIT"
                }
              >
                주문 취소하기
              </Button>
            </ButtonGroup>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
