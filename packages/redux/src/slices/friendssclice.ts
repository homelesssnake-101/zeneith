import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    friends: [] as any[]
}
const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload
        }
    }
});
export const { setFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
