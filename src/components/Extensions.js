import React from "react";

// hooks
import { useExtensionsData } from "../hooks/useExtensionsData";

// UI
import { Extensions as ExtensionsUI } from "@cubitrix/cubitrix-react-ui-module";

const Extensions = () => {
  const { extensionsCardsData } = useExtensionsData();

  return <ExtensionsUI extensionsCardsData={extensionsCardsData} />;
};

export default Extensions;
