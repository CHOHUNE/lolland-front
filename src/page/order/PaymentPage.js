import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";

const apiKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
const orderId = nanoid();

function PaymentPage() {
  const [paymentWidget, setPaymentWidget] = useState(null);

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

  return <div>dddd</div>;
}

export default PaymentPage;
