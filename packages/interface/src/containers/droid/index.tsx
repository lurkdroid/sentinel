import React, { Fragment } from "react"
import { Tab, Switch, Listbox } from "@headlessui/react";
import { CheckIcon } from '@heroicons/react/solid'
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setAmount, setStopLoss, setToLoop, setToken, createDroidInstance} from "../../slices/droidForm"
import { DroidContract, DroidInformation, DroidProps } from '../../utils/types';


export const DroidForm = ()=>{

    const dispatch = useAppDispatch();
    const { amount, stopLoss, toLoop, isValid, tokenAddress } = useAppSelector(state => state.formCreate);
    const tokens = [
        {
        id: "1",
        address: "0xa36085F69e2889c224210F603D836748e7dC0088" //chainlink in kovan
        },
        {
        id: "2",
        address: "0xa36085F69e29c224210F603D8367480088" //fake
        },
];

    return (
        <div>
            <div>
            <Listbox value={tokens} onChange={(t)=> {
                dispatch(setToken((t as unknown as string)));
                }}>
                <Listbox.Button>{tokenAddress || "select token"}</Listbox.Button>
                <Listbox.Options>
                    {tokens.map((t) => (
                        <Listbox.Option key={t.id} value={t.address} as={Fragment}>
                            {({ active, selected }) => (
                                <li
                                className={`${
                                    active ? 'bg-blue-500 text-white' : 'bg-white text-black'
                                }`}
                                >
                                {selected && <CheckIcon />}
                                {t.address}
                                </li>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
            </div>
            <div>
            <input name="defaultAmount" type="text" value={amount} onChange={(e)=>{ dispatch(setAmount(e.target.value))}}/>
            </div>
            <div>
            <input name="stopLossPercent" type="text" value={stopLoss} onChange={(e)=>{ dispatch(setStopLoss(e.target.value))}}/>
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