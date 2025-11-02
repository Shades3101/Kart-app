import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {

    user: any | null;
    isEmailVerified: boolean;
    isLoginDialogOpen: boolean;
    isLoggedIn: boolean;
}

const initialState : UserState = {

    user: null,
    isEmailVerified: false,
    isLoginDialogOpen: false,
    isLoggedIn: false,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        setUser : (state, action: PayloadAction<any | null> ) => {
            state.user = action.payload
        },

        setEmailVerified : (state, action: PayloadAction<boolean> ) => {
            state.isEmailVerified = action.payload;
        },

        logout: (state) => {
            state.user = null;
            state.isLoggedIn =false,
            state.isEmailVerified = false;
        },

        toggleLoginDialog: (State) => {
            State.isLoginDialogOpen = !State.isLoginDialogOpen;
        },

        authStatus: (state) => {
            state.isLoggedIn = true;
        }
    }
});

export const {setUser, setEmailVerified, logout, toggleLoginDialog, authStatus} = userSlice.actions;
export default userSlice.reducer;