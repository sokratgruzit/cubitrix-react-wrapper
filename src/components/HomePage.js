import { useSelector } from "react-redux";
import LandingRegistration from "./LandingRegistration";
import { useState, useEffect } from "react";
import { useConnect } from "@cubitrix/cubitrix-react-connect-module";

import WBNB from "../abi/WBNB.json";
import { LoadingScreen } from "@cubitrix/cubitrix-react-ui-module";

function HomePage({ children }) {
  // const account = useSelector((state) => state.connect.account);
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const metaAcc = useSelector((state) => state.appState?.userData?.meta);
  const { account, library } = useConnect();
  var web3Obj = library;

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  var tokenAddress = "0xE807fbeB6A088a7aF862A2dCbA1d64fE0d9820Cb"; // Staking Token Address

  // useEffect(() => {
  //   if (triedReconnect) {
  //     if (account) {
  //       if (
  //         metaAcc?.address === account?.toLowerCase() &&
  //         metaAcc.email &&
  //         metaAcc.name
  //       ) {
  //         // Check token balance
  //         // console.log(metaAcc, "metaa");
  //         getBalance().then((balance) => {
  //           if (balance >= 100) {
  //             setStep(4);
  //           } else {
  //             setStep(3);
  //           }
  //         });
  //       } else {
  //         setStep(2);
  //       }
  //     } else {
  //       setStep(1);
  //     }
  //     setLoading(false);
  //   }
  // }, [account, triedReconnect, metaAcc, web3Obj]);

  useEffect(() => {
    if (triedReconnect) {
      setTimeout(() => {
        if (account) {
          if (web3Obj && metaAcc) {
            if (
              metaAcc?.address === account?.toLowerCase() &&
              metaAcc.email &&
              metaAcc.name
            ) {
              getBalance().then((balance) => {
                if (balance >= 5000) {
                  setStep(4);
                } else {
                  setStep(3);
                }
              });
            } else {
              setStep(2);
            }
          }
        } else {
          setStep(1);
        }
        setLoading(false);
      }, 0);
    }
  }, [account, triedReconnect, metaAcc, web3Obj]);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  async function getBalance() {
    var tokenContract = new web3Obj.eth.Contract(WBNB, tokenAddress);
    var decimals = await tokenContract.methods.decimals().call();
    var getBalance = await tokenContract.methods.balanceOf(account).call();

    var pow = 10 ** decimals;
    var balanceInEth = getBalance / pow;

    return balanceInEth;
  }

  return step === 4 ? children : <LandingRegistration step={step} setStep={setStep} />;
}

export default HomePage;
