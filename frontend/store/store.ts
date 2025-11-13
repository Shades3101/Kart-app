import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from './slice/userSlice';
import cartReducer from './slice/cartSlice';
import wishlistReducer from './slice/wishlistSlice';
import checkoutReducer from './slice/CheckoutSlice';
import { api } from "./api";

//Persist configuration for user
const userPersistConfig = { key: 'User', storage, whiteList: ['User', 'isEmailVerified', 'isLoggedIn'] } 
const cartPersistConfig = { key: 'cart', storage, whiteList: ['items'] } 
const wishlistPersistConfig = { key: 'wishlist', storage } 
const checkoutPersistConfig = {key: 'checkout', storage}

//wrap reducers with `persist config`
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer)

export const store = configureStore({
    reducer: {
        [api.reducerPath] : api.reducer, //rtk query api
        user: persistedUserReducer,
        cart: persistedCartReducer,
        wishlist: persistedWishlistReducer,
        checkout: persistedCheckoutReducer
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