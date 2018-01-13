import { Med } from '../med';
export class Pet {

    name: string;
    age: string = '';
    info: string = '';
    imgUrl?: string;
    imgId: string;
    meds: Med[] = [];
    vetFirstName = '';
    vetLastName = '';
    vetNumber = '';
    vetAdd1 = '';
    vetAdd2 = '';
    vetCity = '';
    vetState = '';
    vetZip = '';
}