import React from "react"

// init
interface DroidContract { 
    stopLoss: number // 10000 > x > 0
    ethAmount: number // max amount to spend
}

interface DroidInformation extends DroidContract{
    // name: string

    tokens: string[] // address
    symbol: string
    balance: string // in order to pay gas
}

const DroidForm = ()=>{
    return (
        <div>
            <input name="name" type="text" value="" onChange={(e)=>{}}/>

        </div>
    )
}