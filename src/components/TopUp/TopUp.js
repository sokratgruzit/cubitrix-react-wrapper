import React, { useState, useEffect } from "react";
import { TopUpDashboard } from "@cubitrix/cubitrix-react-ui-module";
import axios from "../../api/axios";
import { useSelector } from "react-redux";

const methods = [
  {
    id: "Coinbase",
    title: "Coinbase",
    logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
  },
];

const paymentTypes = [
  {
    id: 2,
    title: "Pay with CoinBase",
    logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
  },
];

const TopUp = () => {
  const account = useSelector((state) => state.connect.account);
  const rates = useSelector((state) => state.appState.rates);
  const [hostedUrl, setHostedUrl] = useState("");

  useEffect(() => {
    if (hostedUrl) {
      window.location.href = hostedUrl;
    }
  }, [hostedUrl]);

  const [coinbaseLoading, setCoinbaseLoading] = useState(false);
  async function handleCoindbasePayment(amount) {
    setCoinbaseLoading(true);
    axios
      .post("api/transactions/coinbase_deposit_transaction", {
        from: account,
        amount,
      })
      .then((res) => {
        setCoinbaseLoading(false);
        setHostedUrl(res?.data?.responseData?.hosted_url);
      })
      .catch((err) => {
        setCoinbaseLoading(false);
        console.error(err);
      });
  }

  async function handlePurchase(method, tokenAmount) {
    if (method === "Coinbase") {
      handleCoindbasePayment(tokenAmount);
    }
  }
  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        height: "calc(100vh)",
      }}>
      <TopUpDashboard
        methods={methods}
        paymentTypes={paymentTypes}
        handlePurchaseEvent={handlePurchase}
        exchangeRate={rates?.["atr"]?.usd}
        tranasctionFee={1}
        coinbaseLoading={coinbaseLoading}
      />
    </div>
  );
};

export default TopUp;
