import React, { Fragment } from "react"
import { Tab, Switch, Listbox } from "@headlessui/react";
import { CheckIcon } from '@heroicons/react/solid'
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { 
    setAmount, 
    setStopLoss, 
    setToLoop, 
    setToken, 
    setTokenName,
    createDroidInstance, 
    setHasSelectedToken,
} from "../../slices/droidForm"

import type { Token} from "../../slices/droidForm"
import { DroidContract, DroidInformation, DroidProps } from '../../utils/types';
import { TokensDropdown } from "../../components/tokensSelect"


export const DroidForm = ()=>{

    const dispatch = useAppDispatch();
    const { 
        amount, 
        stopLoss, 
        toLoop, 
        isValid, 
        tokenName, 
        isSelected,
        token
     } = useAppSelector(state => state.formCreate);
    const { tokens } = useAppSelector(state => state.app);
   


    const renderInput = () =>{
        return (
            <Listbox.Button>
                <input 
                    className="rounded h-10"
                    value={tokenName} 
                    onChange={t => {
                        dispatch(setHasSelectedToken(false));
                        dispatch(setTokenName(t.target.value));
                        dispatch(setToken(null))
                        }
                    }
                />
            </Listbox.Button>
        )

    }

    return (
        <div className="bg-secondary p-4 rounded-lg">
            <div className="mb-11">
                <div className="fixed">
                    <TokensDropdown 
                        label="Base Token: "
                        selected={token || { name: tokenName} as Token}
                        onSelect={t => {
                            dispatch(setToken(t));
                            dispatch(setTokenName(t.name));
                            dispatch(setHasSelectedToken(true));
                        }}
                        tokens={tokens}
                        hasSelected={isSelected}
                        input={renderInput}
                        className=""
                        labelClassName="mr-3"
                    />
                </div>
            </div>
            <div className="flex flex-row justify-between items-center">
                <div className="mr-1">
                <label>amount</label>

                </div>
            <input className="rounded" name="defaultAmount" type="text" value={amount} onChange={(e)=>{ dispatch(setAmount(e.target.value))}}/>
            </div>
            <div className="flex flex-row justify-between items-center">
                <div className="mr-1">
            <label>Percent Loss</label>

                </div>
            <input className="rounded" name="stopLossPercent" type="text" value={stopLoss} onChange={(e)=>{ dispatch(setStopLoss(e.target.value))}}/>
            </div>
            <div className="flex flex-row justify-evenly items-center">
                <div className="mr-1">
                    <label> Loop it</label>
                </div>
                    <div>
                        <Switch
                            checked={toLoop}
                            onChange={()=> dispatch(setToLoop(!toLoop))}
                            className={`${
                                toLoop ? 'bg-blue-600' : 'bg-gray-200'
                            } relative inline-flex items-center h-6 rounded-full w-11`}
                            >
                            <span className="sr-only">Enable notifications</span>
                            <span
                                className={`${
                                toLoop ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                            />
                        </Switch>
                </div>
            </div>

            <button 
            disabled={!isValid} 
            onClick={()=>{
                dispatch(createDroidInstance())
            }}
            className={`bg-blue-500 ${isValid ? 'hover:bg-blue-700' : 'cursor-default'} text-white font-bold py-2 px-4 rounded-full`}>
                Submit
            </button>
           
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