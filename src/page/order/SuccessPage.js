import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiSecretKey = process.env.REACT_APP_TOSS_SECRET_KEY;

function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 수량, 고객번호, 고유 나노아이디, 주문명, 고객명

  ///success?paymentType={PAYMENT_TYPE}&orderId={ORDER_ID}&paymentKey={PAYMENT_KEY}&amount={AMOUNT}

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };
    console.log(requestData);
    async function confirm() {
      try {
        const response = await axios.post(
          "/api/payment/toss/success",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      } catch (error) {
        console.log(error);
        if (error.response) {
          const { code, message } = error.response.data;
          navigate(`/fail?message=${message}&code=${code}`);
        } else {
          console.error("Unexpected error:", error.message);
          navigate("/fail?message=INTERNAL_SERVER_ERROR&code=500");
        }
      }
    }
    confirm();
  }, []);

  return (
    <Card mx="35%" my="5%" shadow="md">
      <CardHeader textAlign="center">
        <Text color="#6FA7DD" fontSize="6xl">
          <FontAwesomeIcon icon={faCircleCheck} />
        </Text>
        <Heading>결제 되었습니다</Heading>
      </CardHeader>
      <CardBody my={5}>
        <Box bgColor="#E6F0FC" color="#086DDD" p={3} borderRadius={10}>
          <Text fontSize="sm">
            <Text as="span" fontWeight="bold">
              주문 번호
            </Text>{" "}
            `${searchParams.get("orderId")}`
          </Text>
          <Text fontSize="sm">
            <Text as="span" fontWeight="bold">
              결제 금액
            </Text>{" "}
            `${Number(searchParams.get("amount").toLocaleString())}원`
          </Text>
        </Box>
      </CardBody>

      {/*<div className="result wrapper">*/}
      {/*  <div className="box_section">*/}
      {/*    <h2>결제 성공</h2>*/}
      {/*    <p>{`주문번호: ${searchParams.get("orderId")}`}</p>*/}
      {/*    <p>{`결제 금액: ${Number(*/}
      {/*      searchParams.get("amount"),*/}
      {/*    ).toLocaleString()}원`}</p>*/}
      {/*    <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </Card>
  );
}

export default SuccessPage;
