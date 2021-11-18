




export function ToDateTimeStr(timestamp: string):string {
        let date = new Date((+timestamp)*1000);

        return date.getDate().toString()+
        "/"+(date.getMonth()+1)+
        "/"+date.getFullYear()+
        " "+date.getHours()+
        ":"+date.getMinutes()+
        ":"+date.getSeconds();    
    }
