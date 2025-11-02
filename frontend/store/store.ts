import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from './slice/userSlice';
import { api } from "./api";

//Persist configuration for user
const userPersistConfig = { key: 'User', storage, whiteList: ['User', 'isEmailVerified', 'isLoggedIn'] } 

//wrap reducers with `persist config`
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
    reducer: {
        [api.reducerPath] : api.reducer, //rtk query api
        user: persistedUserReducer
    },

    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions : [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            },
        }).concat(api.middleware)
});

//setup the listeners for the RTK QUERY
setupListeners(store.dispatch);

//creating a persister 
export const persister = persistStore(store);

//infer the `RootState` and `App Dispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

//inferred type: { posts: PostsState, comments : CommentsState, users: UsersState }
export type AppDispatch = typeof store.dispatch;