const INIT_STATE = {
  sideBarOpen: false,
  sideBar: "",
  userData: null,
  triedReconnect: false,
  isExtensionsLoaded: false,
  coinbaseLoading: false,
  connectionError: "",
  accountsData: [],
  dashboardTransactionsDataReload: {},
  dashboardAccountType: "main",
  exchangeAccountType: "",
  feeWarnAccountType: "",
};

const appStateReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "SET_SIDE_BAR":
      return { ...state, ...action.payload };

    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
        emailVerified: action.payload?.meta?.verified,
        hasPasswordSet: action.payload.hasPasswordSet,
        otp_enabled: action.payload.otp_enabled,
        otp_verified: action.payload.otp_verified,
      };

    case "SET_SYSTEM_ACCOUNT_DATA":
      return {
        ...state,
        userData: {
          ...state?.userData,
          ...action.payload,
        },
        accountsData: state.accountsData.map((account) =>
          account.account_category === "main"
            ? { ...account, balance: action.payload.balance }
            : account,
        ),
      };

    case "UPDATE_ACTIVE_EXTENSIONS":
      return {
        ...state,
        userData: {
          ...state?.userData,
          extensions: { ...state?.userData?.extensions, ...action.payload },
        },
      };

    case "SET_TRIED_RECONNECT":
      return {
        ...state,
        triedReconnect: action.payload,
      };

    case "SET_EXTENSIONS_LOADED":
      return {
        ...state,
        isExtensionsLoaded: action.payload,
      };

    case "UPDATE_COINBASE_LOADING": // add this case
      return {
        ...state,
        coinbaseLoading: action.payload.value,
      };

    case "CONNECTION_ERROR":
      return {
        ...state,
        connectionError: action.payload,
      };

    case "SET_ACCOUNTS_DATA":
      return {
        ...state,
        accountsData: action.payload,
      };
    case "SET_DASHBOARD_TRANSACTIONS_DATA_RELOAD":
      return {
        ...state,
        dashboardTransactionsDataReload: { ...action.payload },
      };
    case "SET_DASHBOARD_ACCOUNT_TYPE":
      return {
        ...state,
        dashboardAccountType: action.payload,
      };
    case "SET_EXCHANGE_ACCOUNT_TYPE":
      return {
        ...state,
        exchangeAccountType: action.payload,
      };
    case "SET_FEE_WARN_TYPE":
      return {
        ...state,
        feeWarnAccountType: action.payload,
      };
    default:
      return state;
  }
};

export default appStateReducer;
