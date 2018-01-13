export class Med {
    totalDoses: string = '';
    remainingDoses: string ='';
    dosage: string = '';
    doseType: string = '';
    durType: string = '';
    doWType: string = '';
    doMType: string = '';

    startDateTime: string = new Date().toISOString();
    mins: string = '';
    hours: string = '';
    // startHr: string = '';
    // startMin: string = '';
    // startPer: string = '';
    
    constructor(public name: string) {
        
    }

}
