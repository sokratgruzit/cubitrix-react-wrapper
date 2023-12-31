import {useSelector} from "react-redux";
import LandingRegistration from "./LandingRegistration";
import {useState, useEffect} from "react";
import {useConnect} from "@cubitrix/cubitrix-react-connect-module";
import {decryptEnv} from "../utils/decryptEnv";

const tokenAddress = decryptEnv(process.env.REACT_APP_TOKEN_ADDRESS);

import WBNB from "../abi/WBNB.json";

function HomePage({children}) {
  const triedReconnect = useSelector((state) => state.appState?.triedReconnect);
  const metaAcc = useSelector((state) => state.appState?.userData?.meta);
  const {account, library} = useConnect();
  var web3Obj = library;

  const [step, setStep] = useState(1);

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
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return step === 4 ? (
    children
  ) : (
    <LandingRegistration step={step} setStep={setStep} />
  );
}

export default HomePage;
