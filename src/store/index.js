import { configureStore, getDefaultMiddleware, combineReducers } from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import extensionsReducer from "./extensionsReducer";
import { connectReducer, stakeReducer } from "@cubitrix/cubitrix-react-connect-module";
import appStateReducer from "./appStateReducer";
// import {stakeReducer} from "./stakeReducer";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  extensions: extensionsReducer,
  appState: appStateReducer,
  connect: persistReducer(persistConfig, connectReducer),
  stake: persistReducer(persistConfig, stakeReducer),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;

export const persistor = persistStore(store);
