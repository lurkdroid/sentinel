
import bigDecimal from "js-big-decimal";

export function toDateTimeStr(timestamp: string):string {
        let dt = new Date((+timestamp)*1000);
        return `${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')}-${
            dt.getFullYear().toString().padStart(4, '0')} ${
            dt.getHours().toString().padStart(2, '0')}:${
            dt.getMinutes().toString().padStart(2, '0')}:${
            dt.getSeconds().toString().padStart(2, '0')}`
    }

export function toDateTimeStrSrt(timestamp: string):string {
    let dt = new Date((+timestamp)*1000);
    return `${
        (dt.getMonth()+1).toString().padStart(2, '0')}-${
        dt.getDate().toString().padStart(2, '0')} ${
        dt.getHours().toString().padStart(2, '0')}:${
        dt.getMinutes().toString().padStart(2, '0')}`
}

export function toTimeStr(timestamp: string):string {
    let dt = new Date((+timestamp)*1000);
    return `${
        dt.getHours().toString().padStart(2, '0')}:${
        dt.getMinutes().toString().padStart(2, '0')}`
}

export function formatAmount(amount:string|number, precision:number){
    if(!amount|| isNaN(+amount)) return "N/A"
    return new bigDecimal(amount).round(precision).getValue();
}

export function formatDecimals(_value:string|number,decimals0:number,decimals1:number){
    let value = new bigDecimal(_value);
    if(decimals0!==decimals1){
        let deciDifference = decimals0-decimals1;
        if(deciDifference>0)
            value = value.divide(new bigDecimal(Math.pow(10,deciDifference)),18);
        else
            value = value.multiply(new bigDecimal(Math.pow(10,deciDifference)));

    }
    return value.getValue();
}
