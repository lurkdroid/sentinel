import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { Position } from "../utils/Position";
import type { networks } from "../utils/tokens"

declare interface DroidStatus {
    position:Position;
}

// const initialState: DroidStatus = {
//     position: new Position(
//         ['asd','asd'],
//         BigNumber.from("1"),
//         BigNumber.from("2"),
//         [BigNumber.from("2"),BigNumber.from("2"),BigNumber.from("2")],
//         1,
//         BigNumber.from("5"),
//         false,
//         BigNumber.from("2"),
//         BigNumber.from("2")
//     )
// }
// const slice = createSlice({
//     "name": "droidStatus",
//     initialState,
//     "reducers": {

//         setDroidStatus(state, action: PayloadAction<number>){
//             state.position=new Position(
//                 ['asd','asd'],
//                 BigNumber.from("1"),
//                 BigNumber.from("2"),
//                 [BigNumber.from("2"),BigNumber.from("2"),BigNumber.from("2")],
//                 1,
//                 BigNumber.from("5"),
//                 false,
//                 BigNumber.from("2"),
//                 BigNumber.from("2"));

//         },
      
//     }
// });
// export const { setDroidStatus,  } = slice.actions
// export { slice as droidStatusSlice };
