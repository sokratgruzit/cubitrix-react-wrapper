import { useSelector, useDispatch } from "react-redux";

// svg
import { StakingIcon } from "../assets/svg";

// api
import axios from "../api/axios";
import { useEffect, useState } from "react";

export const useExtensionsData = () => {
  const account = useSelector((state) => state.connect.account);
  const dispatch = useDispatch();
  const { activeExtensions } = useSelector((state) => state.extensions);
  const appState = useSelector((state) => state.appState);
  const emailVerified = appState.emailVerified;
  const isActive = appState.userData?.active;
  const [extsActive, setExtsActive] = useState({});
  const userBalances = useSelector((state) => state.appState.accountsData);

  const generateAccountsData = async () => {
    try {
      const apiUrl = "/api/accounts/get_account_balances";
      const requestBody = {
        address: account?.toLowerCase(),
      };

      const response = await axios.post(apiUrl, requestBody);
      const data = response.data;
      dispatch({
        type: "SET_ACCOUNTS_DATA",
        payload: data?.data,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChangeExtension = (title, value) => {
    if ((title === "loan" || title === "trade") && (!isActive || !emailVerified)) return;
    if (
      (title === "staking" || title === "referral" || title === "notify") &&
      !emailVerified
    )
      return;

    setExtsActive({ ...extsActive, [title]: value ? "true" : "false" });

    axios
      .post("/api/accounts/manage_extensions", {
        address: account,
        extensions: { [title]: value === true ? "true" : "false" },
      })
      .then((res) => {
        if (res?.data?.account) {
          dispatch({
            type: "UPDATE_ACTIVE_EXTENSIONS",
            payload: res.data.account.extensions,
          });
        }
        setExtsActive(res.data.account.extensions);
        generateAccountsData();
      })
      .catch((e) => {
        console.log(e.response);
        setExtsActive({ ...extsActive, [title]: !value ? "true" : "false" });
      });
  };

  useEffect(() => {
    setExtsActive(activeExtensions);
  }, [activeExtensions]);

  const extensionsCardsData = [
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Trade",
      value: "trade",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) => {
        if (title === "trade" && (!isActive || !emailVerified)) return;

        if (!userBalances.find((item) => item.account_category === "trade") && value) {
          dispatch({
            type: "SET_FEE_WARN_TYPE",
            payload: "trade",
          });
          return;
        }

        handleChangeExtension(title.toLowerCase(), value);
      },
      active: extsActive.trade === "true" ? true : false,
      disabled: !(isActive && emailVerified),
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Staking",
      value: "staking",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) => handleChangeExtension(title.toLowerCase(), value),
      active: extsActive.staking === "true" ? true : false,
      disabled: !emailVerified,
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Loan",
      value: "loan",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) => handleChangeExtension(title.toLowerCase(), value),
      active: extsActive.loan === "true" ? true : false,
      disabled: !(isActive && emailVerified),
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Referral",
      value: "referral",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) => handleChangeExtension(title.toLowerCase(), value),
      active: extsActive.referral === "true" ? true : false,
      disabled: !emailVerified,
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Notifications",
      value: "notify",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) => handleChangeExtension("notify", value),
      active: extsActive.notify === "true" ? true : false,
      disabled: !emailVerified,
    },
  ];

  return {
    handleChangeExtension,
    extensionsCardsData,
  };
};
