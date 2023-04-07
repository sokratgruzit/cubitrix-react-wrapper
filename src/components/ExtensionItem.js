import React from "react";
import { useParams } from "react-router-dom";

// hooks
import { useExtensionsData } from "../hooks/useExtensionsData";

// UI
import { InnerExtensions as ExtensionItemUI } from "@cubitrix/cubitrix-react-ui-module";

const ExtensionItem = () => {
  const { extensionsCardsData } = useExtensionsData();
  const { id } = useParams();

  return <ExtensionItemUI extensionsCardsData={extensionsCardsData} id={id} />;
};

export default ExtensionItem;
