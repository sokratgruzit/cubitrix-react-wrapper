import React, { useState, useEffect } from "react";
import { TopUp as TopUpUI, TopUpDashboard } from "@cubitrix/cubitrix-react-ui-module";
import QRCode from "qrcode";
import axios from "../../api/axios";
import { useSelector, useDispatch } from "react-redux";

const methods = [
  // {
  //   id: "Manual",
  //   title: "Manual",
  //   logo: "https://shopgeorgia.ge/assets/images/contribute/usdt.png",
  // },
  {
    id: "Coinbase",
    title: "Coinbase",
    logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
  },
];

const paymentTypes = [
  // {
  //   id: 1,
  //   title: "Pay via Crypto",
  //   logo: "https://shopgeorgia.ge/assets/images/pay-manual.png",
  // },
  {
    id: 2,
    title: "Pay with CoinBase",
    logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
  },
];

const TopUp = () => {
  const account = useSelector((state) => state.connect.account);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [hostedUrl, setHostedUrl] = useState("");
  const dispatch = useDispatch();

  const [receivePaymentAddress, setReceivePaymentAddress] = useState("0xouraddress");

  useEffect(() => {
    QRCode.toDataURL(receivePaymentAddress)
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [receivePaymentAddress]);

  useEffect(() => {
    if (hostedUrl) {
      window.location.href = hostedUrl;
    }
  }, [hostedUrl]);

  async function handlePaymentConfirm(userAddress, selectedMethod, amount, date) {
    axios
      .post("api/transactions/pending_deposit_transaction", {
        from: account,
        amount: amount,
        amountTransferedFrom: userAddress,
        receivePaymentAddress: receivePaymentAddress,
        startDate: date,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function handleCoindbasePayment(amount) {
    axios
      .post("api/transactions/coinbase_deposit_transaction", {
        from: account,
        amount,
      })
      .then((res) => {
        setHostedUrl(res?.data?.responseData?.hosted_url);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function handlePurchase(method, tokenAmount) {
    if (method === "Coinbase") {
      handleCoindbasePayment(tokenAmount - 1);
    }
  }
  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        height: "calc(100vh)",
      }}
    >
      <TopUpDashboard
        receivePaymentAddress={receivePaymentAddress}
        methods={methods}
        paymentTypes={paymentTypes}
        qrcode={qrCodeUrl}
        handlePurchaseEvent={handlePurchase}
        exchangeRate={2}
        tranasctionFee={1}
      />
    </div>
  );
};

export default TopUp;
