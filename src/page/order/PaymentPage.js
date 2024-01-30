import React, { useContext, useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider";
import axios from "axios";

const apiKey = process.env.REACT_APP_TOSS_CLIENT_KEY;

function PaymentPage() {
  const location = useLocation();
  const { id, order_nano_id, order_name, customer_name, email, phone, amount } =
    location.state;

  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(amount);
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useContext(LoginContext);

  useEffect(() => {
    if (isAuthenticated()) {
      const fetchPaymentWidget = async () => {
        try {
          const loadedWidget = await loadPaymentWidget(apiKey, order_nano_id);
          setPaymentWidget(loadedWidget);
        } catch (error) {
          console.error("Error fetching payment widget:", error);
          navigate("/pay");
        }
      };
      fetchPaymentWidget();
    } else {
      toast({
        title: "권한이 없습니다",
        description: "다시 로그인 해주세요",
        status: "error",
      });
      navigate("/");
    }
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
        orderId: order_nano_id,
        orderName: order_name,
        customerName: customer_name,
        customerEmail: email,
        customerMobilePhone: phone,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        _skipAuth: "FORCE_SUCCESS",
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };

  function handleOrderCancel() {
    axios
      .post("/api/payment/toss/cancel", {
        orderId: order_nano_id,
      })
      .then((response) => {
        toast({
          title: "주문이 성공적으로 취소되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          title: "취소 도중 에러가 발생했습니다",
          description: "다시 한 번 시도해주시거나, 관리자에게 문의해주세요",
          status: "error",
        });
      });
  }

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
            handleOrderCancel();
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
