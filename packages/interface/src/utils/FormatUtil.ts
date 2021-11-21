
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
        
        // return date.getDate().toString()+
        // "/"+(date.getMonth()+1)+
        // "/"+(date.getFullYear()-2000 )+
        // " "+date.getHours()+
        // ":"+date.getMinutes()+
        // ":"+date.getSeconds();    
    }

export function formatAmount(amount:string|number, precision:number){
    return new bigDecimal(amount).round(precision).getValue();
}
