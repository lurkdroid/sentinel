import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import managerAbi from "@solidroid/core/deployed/unknown/SoliDroidManager.json";
import { botInstance_abi } from '../../utils/botInstanceAbi';
import { Position } from '../../utils/Position';
import { BotConfig } from '../../utils/BotConfig';
import { BotInstanceData } from '../../utils/BotInstanceData';
import { BotInstance } from '@solidroid/core/typechain/BotInstance';
import GaugeChart from 'react-gauge-chart'

export const DroidStatus = ()=>{

    const [botData, setData] =  useState<BotInstanceData>(new BotInstanceData());

    let netwrokName="" ;
    async function fetchBotData() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const { chainId } = await provider.getNetwork();
            netwrokName = (await provider.getNetwork()).name;
            
            //TODO get address with chain id
            const managerAddress = "0x72dFdE33BCf0707666D0c2AeC540573aa97dCfaf"
            const manager = new ethers.Contract(managerAddress, managerAbi.abi, provider.getSigner());
        
            const botInstanceAddress = await manager.getBot();
            let botInstance = new ethers.Contract(botInstanceAddress, botInstance_abi, provider.getSigner());
            let result: any[] = await botInstance.getPositionAndAmountOut();
            let _config = await botInstance.getConfig();
            let _position = new Position(result[0]);

            let botData = new BotInstanceData(); 
            botData.config = _config;
            botData.position = _position;
            botData.lastAmount = result[1];
            setData(botData);
          } catch (e){
            console.log("error getting provider or manager", e)
          }
    }

    useEffect( () => {
        const timer = setInterval(fetchBotData,60*1000);       
        return ()=>{
            timer.unref()
        }
      },[])
    
    return (

        // will update it with the grid css later.
        <div className='flex flex-row flex-wrap justify-start font-extrabold'>
            <div className='flex flex-row w-full justify-around'>
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Bot Configuration
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Status:</div>
                        <div>{botData.status()}</div>
                        <div>Quote Asset:</div>
                        <div>{botData.config?.quoteAsset}</div>
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
            </div>
            <div className="flex flex-row w-full justify-around">
                <div className="sd-group">
                    <div className="cb-rect-title">
                        Active Position
                    </div>
                    <div className="list-items cb-rect-items">
                        <div>Trading Pair:</div>
                        <div>{botData.tradingPair()}</div>
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
