import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { Box, Button, ButtonGroup, Checkbox, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

const apiKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
const orderId = nanoid(); // 지우기

function PaymentPage() {
  const [paymentWidget, setPaymentWidget] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderDetail = localStorage.getItem("orderDetail");
    if (storedOrderDetail) {
      const parsedOrderDetail = JSON.parse(storedOrderDetail);
      setOrderInfo(parsedOrderDetail);
      setPrice(parsedOrderDetail.price);
    } else {
      console.log("아무런 주문 정보가 저장되어있지 않습니다");
    }
  }, []);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(apiKey, orderId);
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    };
    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: price },
      { variantKey: "DEFAULT" },
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  const handlePaymentRequest = async () => {
    // 결제 과정에서 악의적으로 결제 금액 변동 유무를 확인
    try {
      await paymentWidget?.requestPayment({
        orderId: orderId,
        orderName: orderInfo.orderName,
        customerName: orderInfo.orderMember,
        customerEmail: orderInfo.customerEmail,
        customerMobilePhone: orderInfo.customerMobilePhone,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        _skipAuth: "FORCE_SUCCESS",
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };

  return (
    <div
      className="wrapper"
      style={{
        width: "50%",
        marginLeft: "25%",
        marginTop: "5%",
        marginBottom: "5%",
      }}
    >
      <div id="payment-widget" />
      <div id="agreement" />
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          w="25%"
          mr={5}
          colorScheme="blue"
          borderRadius={0}
          onClick={handlePaymentRequest}
        >
          결제하기
        </Button>
        <Button
          w="25%"
          borderRadius={0}
          onClick={() => {
            localStorage.removeItem("orderDetail");
            localStorage.removeItem("purchaseInfo");
            navigate("/");
          }}
        >
          결제 취소
        </Button>
      </div>
    </div>
  );
}

export default PaymentPage;
