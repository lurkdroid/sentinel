import React, { Fragment } from "react"
import { Tab, } from "@headlessui/react";
import { DroidContract, DroidInformation, DroidProps } from '../../utils/types';
// init
export const DroidForm = ()=>{
    return (
        <div>
            <div>
            <input name="name" type="text" value="" onChange={(e)=>{}}/>
            </div>
            <div>
            <input name="stoploss" type="text" value="" onChange={(e)=>{}}/>
            </div>
            <div>
            <input name="checkbox" type="text" value="" onChange={(e)=>{}}/>
            </div>
            <div>
            <input name="initialAmount" type="text" value="" onChange={(e)=>{}}/>

            </div>
        </div>
    )
}

const selectTab = (title: string)=> ({selected}: {selected: boolean} )=>(
    <button
    className={`
      ${selected ? 'bg-secondary text-white' : 'bg-white text-black dark:bg-black-type1 dark:text-white'} 
      rounded-t-lg p-2
      `
    }
  >
    {title}
  </button> 
)
const DroidCard = (props: DroidProps) => {

    return(
    <Tab.Group>
        <Tab.List className={"bg-white dark:bg-black-type1"}>
        <Tab as={Fragment}>
          {selectTab("Summary")}
        </Tab>
        <Tab as={Fragment}>
        {selectTab("History")}
        </Tab>
        <Tab as={Fragment}>
         {selectTab("Update")}
        </Tab>
        </Tab.List>
        <Tab.Panels>
            <Tab.Panel> 
                <DroidView {...props}/>
            </Tab.Panel>
            <Tab.Panel>
                <DroidTransactions {...props}/>
            </Tab.Panel>
            <Tab.Panel>
                <DroidUpdate {...props}/>
            </Tab.Panel>
        </Tab.Panels>
    </Tab.Group>
    )
}

export function DroidView(props: DroidProps){

    const { ethAmount, tokens, trades, stopLoss, symbol } = props;
    return(
        <div className={`text-white p-2`}>
            <div>
                Investments:
            </div>
            <div>
                Profits:
            </div>
            <div>
                Losses:
            </div>
            <div>
                Balance
            </div>
            <div>
                ethAmount: {ethAmount}
            </div>
            <div>
                stopLoss: {stopLoss} %
            </div>

        </div>
    )
}

export function DroidTransactions(props:DroidProps){
    return(
        <div>
            droidtransactions
        </div>
    )
}

export function DroidUpdate(props: DroidProps){
    return(
        <div>
            <div>
                stopLoss {props.stopLoss} %
                <input 
                name="stoploss" 
                type="text"
                defaultValue={props.stopLoss}
                className={`bg-secondary w-28 max-w-min ml-1 rounded`}/>
            </div>
        </div>
    )
}




export default DroidCard