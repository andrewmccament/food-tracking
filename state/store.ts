import { configureStore, combineReducers } from "@reduxjs/toolkit";
import foodSlice from "./foodSlice";
import userDataSlice from "./userDataSlice";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

AsyncStorage.clear();

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userData", "food"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    userData: userDataSlice,
    food: foodSlice,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
