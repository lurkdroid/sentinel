import {  ethers } from 'ethers';
import { useEffect, useState } from 'react';
// import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import { configFromArray } from '../../utils/BotConfig';
import { BotInstanceData } from '../../utils/BotInstanceData';
import GaugeChart from 'react-gauge-chart'
import { managerAddress } from '../../utils/data/sdDatabase';
import { positionFromArray } from '../../utils/Position';

export const DroidStatus = ()=>{
    
    console.log("IN DROID STATUS !!!!");
    const [botData, setData] =  useState<BotInstanceData>(new BotInstanceData());

    async function  fetchBotData() {
        console.log("CALL FATCH DATA !!!!");
        console.log(new Date().toTimeString());
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            let network = (await provider.getNetwork()).name;
            const manager = new ethers.Contract(managerAddress(network), managerAbi.abi, provider.getSigner());
            const botAddress = await manager.getBot();
            const _config = await fetch(`http://localhost:8000/config?address=${botAddress}`);
            const response = await fetch(`http://localhost:8000/position?address=${botAddress}`);
            const result = await response.json();
            const confResult = await _config.json();

            let botData = new BotInstanceData(); 
            botData.network = network;
            botData.config = configFromArray(confResult);
            botData.position = positionFromArray(result[0]) ;
            botData.lastAmount = result[1];
            setData(botData);

          } catch (e){
            console.log("error getting provider or manager", e)
          }
    }

    useEffect( () => {
        fetchBotData();
        const nIntervId = setInterval(fetchBotData,60*1000);       
        return ()=>{
            try {
                clearInterval(nIntervId);
            } catch (error) { 
            }
        }
    },[])

    function backend(url:string){
        console.log("in call api");
        fetch(url)
            .then(res => {return res.json})
    }

    return (

        // will update it with the grid css later.
        <div className='flex flex-row flex-wrap justify-start font-extrabold'>
            <div className='flex flex-row justify-around w-full'>
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Bot Configuration  {botData.config?.defaultAmountOnly?.toString()}
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Status:</div>
                        <div>{botData.status()}</div>
                        <div>Quote Asset:</div>
                        <div>
                            <div>
                                {botData.quoteAssetName()}
                            </div>
                            <div>
                                <img className='sm-24' src={botData.quoteAssetImage()} /></div>
                            </div>
                        <div>Default Amount:</div>
                        <div>{botData.defaultAmount()}</div>
                        <div>Default Amount Only:</div>
                        <div>False</div>
                        <div>Stop Loss Percent:</div>
                        <div>%{botData.stopLossPercent()}</div>
                        <div>Loop:</div>
                        <div>True</div>
                    </div>
                </div>
                {botData.active()?
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Price Data
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Average Buy price:</div>
                        <div>{botData.averageBuyPrice()}</div>
                        <div>Average Sell price:</div>
                        <div>{botData.averageSellPrice()}</div>
                        <div>Last price:</div>
                        <div className='price'>{botData.lastPrice()}</div>
                        <div>Next target:</div>
                        <div className='target'>{botData.targetPrice()}</div>
                        <div>Stop Loss:</div>
                        <div className='sl'>{botData.stopLossPrice()}</div>
                    </div>
                </div>
                :""}
            </div>
            <div className="flex flex-row justify-around w-full">
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Active Position
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Trading Pair:</div>
                        <div>
                            <img className='sm-24' src={botData.quoteAssetImage()}/>
                            <img className='sm-24' src={botData.baseAssetImage()} />
                            {botData.quoteAssetName()}-
                            {botData.baseAssetName()}</div>
                        <div>Current Quote Amount :</div>
                        <div>{botData.quoteAmount()}</div>
                        <div>Current Base Amount:</div>
                        <div>{botData.baseAmount()}</div>
                        <div>Time Entered:</div>
                        <div>{botData.timeEntered()}</div>
                    </div>
                </div>

                <div className="sd-group">
                    <div className="cb-rect-title">
                        Position Profit
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Current Profit %:</div>
                        <div>{botData.profit()}</div>
                        <div>Current Profit $:</div>
                        <div>{botData.usdProfit()}</div>
                        <div>Current Quote Amount :</div>
                        <div>{botData.quoteAmount()}</div>
                        <div>Current Base Amount:</div>
                        <div>{botData.baseAmount()}</div>
                        <div>Targets Sold:</div>
                        <div>{botData.targetSold()}</div>
                    </div>
                </div>
            </div>
            <div className="w-1/4">
                <GaugeChart id="gauge-chart5"
                    animate={false}
                    nrOfLevels={4}
                    arcsLength={[0.25, 0.25, 0.25,0.25]}
                    colors={[  '#EA4228','#5BE12C','#38C71B','#266D17']}
                    percent={botData.gaugePercent()}
                    arcPadding={0.02}
                    />
            </div>
        </div>
    )
}
