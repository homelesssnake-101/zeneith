import {createSlice} from "@reduxjs/toolkit";
const initialState = {
    user: null
}
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state : any, action : any) => {
            state.user = action.payload
        }
    }
})
export const { setUsers } = userSlice.actions
export default userSlice.reducer
