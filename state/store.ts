import { configureStore, combineReducers } from "@reduxjs/toolkit";
import foodSlice from "./foodSlice";
import userDataSlice, { resetDefaultUserGoals } from "./userDataSlice";
import { persistStore, persistReducer } from "redux-persist";
import { createMigrate } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

//AsyncStorage.clear();

const migrations = {
  1: (state: any) => ({
    ...state,
    userData: resetDefaultUserGoals(state?.userData),
  }),
  2: (state: any) => ({
    ...state,
    userData: resetDefaultUserGoals(state?.userData),
  }),
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  version: 2,
  whitelist: ["userData", "food"],
  migrate: createMigrate(migrations, { debug: false }),
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
