import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

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
        navigate("/");
      } catch (error) {
        if (error.response) {
          const { code, message } = error.response.data;
          navigate(`/fail?message=${message}&code=${code}`);
        } else {
          console.error("Unexpected error:", error.message);
          navigate("/fail?message=Unexpected error&code=500");
        }
      }
    }
    confirm();
  }, []);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(
          searchParams.get("amount"),
        ).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>
      </div>
    </div>
  );
}

export default SuccessPage;
