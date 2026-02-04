const axios = require("./axios");

const CASHFREE_BASE_URL = process.env.CASHFREE_API_URL;

const cashfreeHeaders = {
  "x-client-id": process.env.CASHFREE_CLIENT_ID,
  "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
  "x-api-version": "2023-08-01",
  "Content-Type": "application/json",
};

exports.createPaymentSession = async ({
  orderId,
  amount,
  customerId,
  customerPhone,
}) => {
  const response = await axios.post(
    `${CASHFREE_BASE_URL}/orders`,
    {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },
    },
    { headers: cashfreeHeaders }
  );

  return response.data;
};

exports.getPaymentStatus = async (orderId) => {
  const response = await axios.get(
    `${CASHFREE_BASE_URL}/orders/${orderId}`,
    { headers: cashfreeHeaders }
  );

  return response.data;
};
