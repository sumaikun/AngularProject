export class Rule {
    id:string;
    ruleType:string;
    supplier:string;
    operationType:string;
    selectedFields:string[];
    if:string;
    then:string;
    similarity:string

    constructor(){
        this.id = null;
        this.ruleType = null;
        this.supplier = null;
        this.operationType = null;
        this.selectedFields = []
        this.if = null;
        this.then = null;
        this.similarity = null;
    }
}