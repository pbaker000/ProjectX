import { Med } from '../med';
export class Pet {
    name: string;
    age: string = '';
    info: string = '';
    imgUrl?: string;
    imgId: string;
    meds: Med[] = [];
}