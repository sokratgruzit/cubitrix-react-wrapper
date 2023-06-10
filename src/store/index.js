import { configureStore, getDefaultMiddleware, combineReducers } from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import extensionsReducer from "./extensionsReducer";
// import { connectReducer, stakeReducer } from "@cubitrix/cubitrix-react-connect-module";
import { connectReducer } from "./connectReducer";
import { stakeReducer } from "./stakeReducer";
import appStateReducer from "./appStateReducer";

const connectPersistConfig = {
  key: "connect",
  storage,
  stateReconciler: autoMergeLevel2,
};

const stakePersistConfig = {
  key: "stake",
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  extensions: extensionsReducer,
  appState: appStateReducer,
  connect: persistReducer(connectPersistConfig, connectReducer),
  stake: persistReducer(stakePersistConfig, stakeReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;

export const persistor = persistStore(store);
