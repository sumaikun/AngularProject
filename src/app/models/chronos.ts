export class Chronos {
    id: string;
    title: string;
    supplier: string;
    description: string;  
    automatical: boolean;    
    rules: string[];   

    constructor(){
        this.id = null;
        this.title = null;
        this.supplier = null;
        this.description = null;
        this.automatical = false;
        this.rules = [];
    }
}