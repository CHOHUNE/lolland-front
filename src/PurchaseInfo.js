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
  List,
  ListItem,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./component/LoginProvider";
import axios from "axios";
import * as PropTypes from "prop-types";

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

  return (
    <Card w="full">
      {orderInfo && (
        <>
          <CardHeader>
            <Heading textAlign="left" mb={5}>
              결제 내역 상세정보
            </Heading>
            <Text textAlign="left" fontSize="lg">
              {orderInfo.order_name}
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid
              columns={2}
              spacing={10}
              gridTemplateColumns="200px 1fr"
            >
              <Box fontWeight="bold">주문 번호</Box>
              <Box>{orderInfo.order_name}</Box>
              <Box fontWeight="bold">주문명</Box>
              <Box>{orderInfo.order_nano_id}</Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontWeight="bold"
              >
                주문 상품
              </Box>
              <Box>
                <List>
                  {orderInfo.productList.map((product) => (
                    <ListItem key={product.product_id}>
                      {product.product_name} {product.option_name} (
                      {product.quantity}개)
                      {/*{product.total_price.toLocaleString()}원*/}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box fontWeight="bold">주문 금액</Box>
              <Box>{orderInfo.total_price.toLocaleString()}원</Box>
            </SimpleGrid>
          </CardBody>
          <CardFooter display="flex" justifyContent="center">
            <ButtonGroup justifyContent="center" w="full">
              <Button w="40%">영수증 인쇄</Button>
              <Button w="40%" onClick={() => cancelOrderRequest()}>
                주문 취소하기
              </Button>
            </ButtonGroup>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
