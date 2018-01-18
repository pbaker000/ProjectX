export class Med {
    totalDoses: string = '';
    remainingDoses: string ='';
    dosage: string = '';
    doseType: string = '';
    durType: string = '';
    doWType: string = '';
    doMType: string = (new Date().getDate()-1).toString() + "-" + (new Date().getDate()-2).toString();
    primaryNot: boolean = false;
    startDateTime: string = new Date().toISOString();
    mins: string = '';
    hours: string = '';
    // startHr: string = '';
    // startMin: string = '';
    // startPer: string = '';
    
    constructor(public name: string) {
        
    }

}
