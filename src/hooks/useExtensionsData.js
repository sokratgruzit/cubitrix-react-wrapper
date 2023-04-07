import { useSelector, useDispatch } from "react-redux";

// svg
import { StakingIcon } from "../assets/svg";

// api
import axios from "../api/axios";

export const useExtensionsData = () => {
  const account = useSelector((state) => state.connect.account);
  const dispatch = useDispatch();
  const { activeExtensions } = useSelector((state) => state.extensions);
  const appState = useSelector((state) => state.appState);
  const emailVerified = appState.emailVerified;
  const isActive = appState.userData?.system?.[0]?.active;

  const handleChangeExtension = (title, value) => {
    if (title === "loan") {
      if (!isActive || !emailVerified) return;
    }
    if (title === "staking" || title === "referral" || title === "trade") {
      if (!emailVerified) return;
    }
    axios
      .post("/api/accounts/manage_extensions", {
        address: account,
        extensions: { [title]: value === true ? "true" : "false" },
      })
      .then((res) => {
        console.log(res.data);
        if (res?.data?.account) {
          dispatch({
            type: "UPDATE_ACTIVE_EXTENSIONS",
            payload: res.data.account.extensions,
          });
        }
      })
      .catch((e) => console.log(e.response));
  };

  const extensionsCardsData = [
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Trade",
      value: "trade",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) =>
        handleChangeExtension(title.toLowerCase(), value),
      active: activeExtensions.trade === "true" ? true : false,
      disabled: !(isActive && emailVerified),
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Staking",
      value: "staking",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) =>
        handleChangeExtension(title.toLowerCase(), value),
      active: activeExtensions.staking === "true" ? true : false,
      disabled: !emailVerified,
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Loan",
      value: "loan",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) =>
        handleChangeExtension(title.toLowerCase(), value),
      active: activeExtensions.loan === "true" ? true : false,
      disabled: !(isActive && emailVerified),
    },
    {
      icon: <StakingIcon className={"other-extensions-card-icon"} />,
      title: "Referral",
      value: "referral",
      description:
        "Crust pencil novel colours drift unfamed, oft line balls instructed sociis.",
      hash: "0x74a81F84268744a40FEBc48f8b812a1f188D80C3",
      handleSwitch: (title, value) =>
        handleChangeExtension(title.toLowerCase(), value),
      active: activeExtensions.referral === "true" ? true : false,
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
      active: activeExtensions.notify === "true" ? true : false,
      disabled: false,
    },
  ];

  return {
    handleChangeExtension,
    extensionsCardsData,
  };
};
