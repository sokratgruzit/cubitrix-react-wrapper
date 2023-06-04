import React, { useState, useEffect } from "react";
import { TopUp as TopUpUI } from "@cubitrix/cubitrix-react-ui-module";
import QRCode from "qrcode";

const methods = [
  {
    id: "USDT",
    title: "USDT",
    logo: "https://shopgeorgia.ge/assets/images/contribute/usdt.png",
  },
  {
    id: "Coinbase",
    title: "Coinbase",
    logo: "https://shopgeorgia.ge/assets/images/contribute/eth.png",
  },
];

const TopUp = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const receivePaymentAddress = "0x420";

  useEffect(() => {
    QRCode.toDataURL(receivePaymentAddress)
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [receivePaymentAddress]);

  return (
    <div style={{ display: "flex", gap: "30px", paddingTop: "200px" }}>
      <TopUpUI
        receivePaymentAddress={receivePaymentAddress}
        handlePaymentConfirm={() => console.log("payment confirm")}
        handlePaymentProcess={(selected, agreed) =>
          console.log("payment process", selected, agreed)
        }
        methods={methods}
        qrcode={qrCodeUrl}
      />
    </div>
  );
};

export default TopUp;
