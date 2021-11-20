
import bigDecimal from "js-big-decimal";

export function ToDateTimeStr(timestamp: string):string {
        let date = new Date((+timestamp)*1000);

        return date.getDate().toString()+
        "/"+(date.getMonth()+1)+
        "/"+(date.getFullYear()-2000 )+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds();    
    }

export function formatAmount(amount:string|number, precision:number){
    return new bigDecimal(amount).round(precision).getValue();
}
