export class User {
    id: string;
    nickname: string;
    name: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    phone: string;
    cellPhone: string;
    role: string;
    state: string;
    documentType: string;
    documentNumber: string;
    suppliers: string[];

    constructor(){
        this.id = null;
        this.nickname = "";
        this.name = "";
        this.lastName = "";
        this.email = "";
        this.address = "";
        this.city = "";
        this.phone = "";
        this.cellPhone = "";
        this.role = "";
        this.state = "";
        this.documentType = "";
        this.documentNumber = "";
        this.suppliers = null;
    }
}