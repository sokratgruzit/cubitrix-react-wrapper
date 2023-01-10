import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import extensionsReducer from './extensionsReducer';
import { connectReducer } from '@cubitrix/cubitrix-react-connect-module';

const rootReducer = combineReducers({
  extensions: extensionsReducer,
  connect: connectReducer
});

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;

export const persistor = persistStore(store);
