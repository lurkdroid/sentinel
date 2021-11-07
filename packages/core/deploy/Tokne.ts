//

import { threadId } from "worker_threads";

//
export class Token{
    name:string;
    address:string;
    isQuote:boolean;
    constructor(_name:string,_address:string,_isQuote:boolean){
        this.name=_name;
        this.address = _address;
        this.isQuote=_isQuote;
    }
}