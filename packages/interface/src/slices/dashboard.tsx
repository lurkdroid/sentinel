import { createAction, createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";

// export const setIsDark = createAction<boolean>("@@THEME/DARK_MODE");
// const reducer = createReducer(true, (builder)=>{
//     builder.addCase(setIsDark,(state, {payload})=>{
//         state = payload;
//     })
//     .addDefaultCase((state,action)=> state)
// })
const initialState = {
    menu: false,
    dark: true
}
const slice = createSlice({
    "name": "dashboard",
    initialState,
    "reducers": {

        setIsDark(state, action: PayloadAction<boolean>){
            state.dark = action.payload;
        },
        setMenu(state, action: PayloadAction<boolean>){
            state.menu = action.payload;
        }
    }
});
export const { setIsDark, setMenu } = slice.actions
export { slice as dashboardSlice };



