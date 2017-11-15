import { Med } from '../med';
export interface Pet {
    name: string;
    age: string;
    info: string;
    imageUrl?: string;
    imgId: string;
    meds: Array<Med>;
    
}